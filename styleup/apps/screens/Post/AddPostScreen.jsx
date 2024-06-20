import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Dimensions,
    Animated,
    Button,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { Formik } from "formik";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "@clerk/clerk-expo";
import {
    Ionicons,
    MaterialIcons,
    Feather,
    FontAwesome5,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { fetchWithTimeout } from "../../../utils/fetchWithTimeout";
import { CameraView, useCameraPermissions } from "expo-camera";
import {
    useFonts,
    JosefinSans_400Regular,
    JosefinSans_700Bold,
} from "@expo-google-fonts/josefin-sans";
import * as MediaLibrary from 'expo-media-library';                                

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function AddPostScreen() {
    let [fontsLoaded] = useFonts({
        JosefinSans_400Regular,
    });
    const { width: screenWidth, height: screenHeight } =
        Dimensions.get("window");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user } = useUser();
    const navigation = useNavigation();
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState("back");
    const camera = useRef(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            aspect: [16, 9],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const takePicture = async () => {
        if (camera.current) {
            const options = {
                quality: 1,
                base64: true,
                fixOrientation: true,
                exif: true,
            };
            let photo = await camera.current.takePictureAsync(options);
            setImage(photo.uri);
        }
    };

    const clearImage = () => {
        setImage(null);
    };

    const saveImage = async () => {
        try {
            const asset = await MediaLibrary.saveToLibraryAsync(image); // Saves the photo to the gallery
            console.log('Image saved successfully!');
        } catch (error) {
            console.log("Error saving photo: ", error);
        }
    };

    const onSubmitMethod = async (values) => {
        setLoading(true);
        try {
            // Create a FormData object to encapsulate the file data
            let formData = new FormData();
            formData.append("file", {
                uri: image,
                name: `post_${Date.now()}.jpg`,
                type: "image/jpeg",
            });

            // Append other form values that you want to send along with the file
            formData.append("description", values.description);
            formData.append("shops", values.shops);
            formData.append("category", values.category);
            // Post request to Flask endpoint
            const response = await fetchWithTimeout(
                `https://3cc7-2600-1700-3680-2110-c494-b15d-2488-7b57.ngrok-free.app/upload/${user.id}`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const result = await response.json();
            if (response.ok) {
                saveImage(image);
                setImage(null);
                Alert.alert("Success!", "Post Added Successfully.");
                navigation.navigate("Profile", { from: "AddPost" });
            } else {
                Alert.alert("Error", result.message || "An error occurred");
            }
        } catch (error) {
            console.error("Error uploading post", error);
            Alert.alert("Error", "Failed to upload post.");
        } finally {
            setLoading(false);
        }
    };

    function toggleCameraFacing() {
        setFacing((current) => (current === "back" ? "front" : "back"));
    }

    if (!permission) {
        // Camera permissions are still loading.
        return (
            <View>
                <Text>Permissions are loading.</Text>
            </View>
        );
    }
    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: "center" }}>
                    We need your permission to show the camera
                </Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Formik
                initialValues={{
                    description: "",
                    shops: "",
                    createdAt: Date.now(),
                    likes: 0,
                    shares: 0,
                }}
                onSubmit={(values) => onSubmitMethod(values)}
            >
                {({ handleChange, handleSubmit, values }) => (
                    <View style={styles.container}>
                        {image ? (
                            <View style={styles.image}>
                                <View style={styles.exitButton}>
                                    <TouchableOpacity onPress={clearImage}>
                                        <Feather
                                            name="x"
                                            size={24}
                                            color="white"
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.submitButton}>
                                    <TouchableOpacity onPress={handleSubmit}>
                                        <Text style={styles.submitButtonText}>
                                            Post
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <Image
                                    source={{ uri: image }}
                                    style={styles.camera}
                                />
                                <KeyboardAvoidingView
                                    behavior={
                                        Platform.OS === "ios"
                                            ? "padding"
                                            : "height"
                                    }
                                    style={styles.inputContainer}
                                    keyboardVerticalOffset={70}
                                >
                                    <TextInput
                                        style={styles.inputText}
                                        placeholder="description(optional)"
                                        placeholderTextColor={"white"}
                                        onChangeText={handleChange(
                                            "description"
                                        )}
                                    />
                                </KeyboardAvoidingView>
                            </View>
                        ) : (
                            <CameraView
                                style={styles.camera}
                                facing={facing}
                                ref={camera}
                            >
                                <TouchableOpacity
                                    style={styles.submitButton}
                                    onPress={toggleCameraFacing}
                                >
                                    <Ionicons
                                        name="camera-reverse-outline"
                                        size={24}
                                        color="white"
                                    />
                                </TouchableOpacity>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={takePicture}
                                    >
                                        <FontAwesome5
                                            name="circle"
                                            size={52}
                                            color="white"
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.galleryContainer}>
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={pickImage}
                                    >
                                        <Ionicons
                                            name="images-outline"
                                            size={24}
                                            color="white"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </CameraView>
                        )}
                    </View>
                )}
            </Formik>
        </View>
    );
}

const styles = StyleSheet.create({
    camera: {
        flex: 1,
        height: screenWidth * (9 / 16),
        width: "100%",
        resizeMode: "contain",
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        flex: 1,
        height: screenWidth * (9 / 16),
        width: "100%",
        resizeMode: "contain",
        alignItems: "left",
    },
    container: {
        flex: 1,
        backgroundColor: "black",
        paddingTop: 25,
    },
    buttonContainer: {
        flexDirection: "row",
        position: "absolute",
        bottom: 50,
        width: 58,
        alignItems: "center",
        justifyContent: "center",
    },
    galleryContainer: {
        flexDirection: "row",
        position: "absolute",
        bottom: 60,
        right: 120,
        width: 36,
        justifyContent: "center",
    },
    inputContainer: {
        flexDirection: "row",
        position: "absolute",
        bottom: 60,
        paddingLeft: 10,
    },
    inputText: {
        fontSize: 18,
        color: "white",
        fontFamily: "JosefinSans_400Regular",
        backGroundColor: "white",
    },
    button: {
        flex: 1,
        alignSelf: "flex-end",
        alignItems: "center",
    },
    exitButton: {
        position: "absolute",
        top: 20,
        left: 20,
        zIndex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    submitButton: {
        position: "absolute",
        top: 24,
        right: 20,
        zIndex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    submitButtonText: {
        fontSize: 22,
        fontWeight: "bold",
        color: "white",
        fontFamily: "JosefinSans_700Bold",
    },
    text: {
        fontSize: 22,
        fontWeight: "bold",
        color: "white",
    },
});
