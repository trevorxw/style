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
    ScrollView,
    Modal,
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
import * as MediaLibrary from "expo-media-library";

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

    // Camera
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState("back");
    const camera = useRef(null);

    // Shops
    const [shops, setShops] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentShop, setCurrentShop] = useState({
        index: -1,
        name: "",
        url: "",
    });

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

    const clearShops = () => {
        setShops([]);
    };

    const saveImage = async () => {
        try {
            const asset = await MediaLibrary.saveToLibraryAsync(image); // Saves the photo to the gallery
            console.log("Image saved successfully!");
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
            formData.append("shops", shops);
            console.log(formData);
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
                clearImage();
                clearShops();
                Alert.alert("Success!", "Post Added Successfully.");
                navigation.navigate("Profile", { from: "AddPost" });
            } else {
                Alert.alert("Error", result.message || "An error occurred");
            }
        } catch (error) {
            if (error.name === "AbortError") {
                console.error("Fetch aborted:", error);
                Alert.alert("Error", "Request timed out, please try again");
            } else {
                console.error("Error uploading post", error);
                Alert.alert("Error", "Failed to upload post.");
            }
        } finally {
            setLoading(false);
        }
    };

    function toggleCameraFacing() {
        setFacing((current) => (current === "back" ? "front" : "back"));
    }

    const handleAddShop = () => {
        setCurrentShop({ index: shops.length, name: "", url: "" });
        setIsEditing(true);
    };

    const handleEditShop = (index) => {
        setCurrentShop({
            index,
            name: shops[index].name,
            url: shops[index].url,
        });
        setIsEditing(true);
    };

    const saveShop = () => {
        const { index, name, url } = currentShop;
        const updatedShops = [...shops];
        if (index >= shops.length) {
            updatedShops.push({ name, url }); // Add new shop
        } else {
            updatedShops[index] = { name, url }; // Update existing shop
        }
        setShops(updatedShops);
        setIsEditing(false);
    };

    const delShop = () => {
        const { index, name, url } = currentShop;
        const updatedShops = [...shops];
        if (index < shops.length) {
            updatedShops.splice(index, 1); // delete shop
        } else {
        }
        setShops(updatedShops);
        setIsEditing(false);
    };

    const closeModal = () => {
        setIsEditing(false);
    };

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
                                    <TouchableOpacity
                                        onPress={() => {
                                            clearImage();
                                            clearShops();
                                        }}
                                    >
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
                                {loading ? (
                                    <View style={styles.loading}>
                                        <ActivityIndicator size="large" />
                                    </View>
                                ) : (
                                    <Text></Text>
                                )}
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
                                        placeholderTextColor={
                                            "rgba(256, 256, 256, 0.75)"
                                        }
                                        onChangeText={handleChange(
                                            "description"
                                        )}
                                    />
                                    <ScrollView
                                        style={styles.shops}
                                        horizontal={true}
                                    >
                                        {shops.map((shop, index) => (
                                            <View
                                                key={index}
                                                style={styles.box}
                                            >
                                                <TouchableOpacity
                                                    style={styles.shopBox}
                                                    onPress={() =>
                                                        handleEditShop(index)
                                                    }
                                                >
                                                    <Text
                                                        style={styles.shopText}
                                                    >
                                                        {shop.name}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                        {/* Placeholder box */}
                                        <TouchableOpacity
                                            onPress={handleAddShop}
                                            style={styles.shopBox}
                                        >
                                            <Ionicons
                                                name="add"
                                                size={16}
                                                color="rgba(0, 0, 0, 0.5)"
                                            />
                                        </TouchableOpacity>
                                    </ScrollView>
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
                        {isEditing && (
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={isEditing}
                                onRequestClose={closeModal}
                            >
                                <View style={styles.modalView}>
                                    <View style={styles.modalInput}>
                                        <TextInput
                                            style={styles.modalText}
                                            onChangeText={(text) =>
                                                setCurrentShop({
                                                    ...currentShop,
                                                    name: text,
                                                })
                                            }
                                            value={currentShop.name}
                                            placeholder="item"
                                            placeholderTextColor={
                                                "rgba(0, 0, 0, 0.5)"
                                            }
                                        />
                                        <View style={styles.divider} />
                                        <TextInput
                                            style={styles.modalText}
                                            onChangeText={(text) =>
                                                setCurrentShop({
                                                    ...currentShop,
                                                    url: text,
                                                })
                                            }
                                            value={currentShop.url}
                                            placeholder="link"
                                            placeholderTextColor={
                                                "rgba(0, 0, 0, 0.5)"
                                            }
                                        />
                                    </View>
                                    <View style={{ flexDirection: "row" }}>
                                        <View style={styles.modalSave}>
                                            <TouchableOpacity
                                                style={styles.saveButton}
                                                onPress={saveShop}
                                            >
                                                <Feather
                                                    name="check"
                                                    size={24}
                                                    color="white"
                                                />
                                            </TouchableOpacity>
                                        </View>

                                        <View style={styles.modalDel}>
                                            <TouchableOpacity
                                                style={styles.saveButton}
                                                onPress={delShop}
                                            >
                                                <Ionicons
                                                    name="remove"
                                                    size={24}
                                                    color="white"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
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
        position: "absolute",
        justifyContent: "center",
        bottom: 15,
        paddingLeft: 10,
    },
    inputText: {
        fontSize: 18,
        color: "rgba(256, 256, 256, 0.75)",
        fontFamily: "JosefinSans_400Regular",
        backGroundColor: "white",
    },
    shops: {
        marginTop: 20,
        width: "100%",
    },
    shopBox: {
        backgroundColor: "rgba(256, 256, 256, 0.9)",
        borderRadius: 30,
        marginRight: 4,
        paddingHorizontal: 5,
        paddingVertical: 2,
    },
    shopText: {
        color: "rgba(0, 0, 0, 0.5)",
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
    loading: {
        position: "absolute",
        marginTop: (screenHeight * 1.3) / 3,
        left: screenWidth / 2,
        transform: [
            // Center horizontally by subtracting half the width of the indicator
            { translateX: -18 },
            // Center vertically by subtracting half the height of the indicator
            { translateY: -18 },
        ],
        zIndex: 1,
        padding: 3,
        justifyContent: "center",
        alignContent: "center",
    },
    text: {
        fontSize: 22,
        fontWeight: "bold",
        color: "white",
    },
    modalView: {
        marginTop: screenHeight / 3,
        marginHorizontal: 40,
        padding: 15,
        alignItems: "center",
    },
    modalSave: {
        transform: [
            // Center horizontally by subtracting half the width of the indicator
            { translateX: 176 / 2 - 12 },
            // Center vertically by subtracting half the height of the indicator
        ],
    },
    modalDel: {
        transform: [
            // Center horizontally by subtracting half the width of the indicator
            { translateX: -(176 / 2 - 12) },
            // Center vertically by subtracting half the height of the indicator
        ],
    },
    modalInput: {
        backgroundColor: "rgba(256, 256, 256, 0.6)",
        borderRadius: 20,
        justifyContent: "center",
        paddingVertical: 10,
        paddingHorizontal: 10,
        height: 70,
        width: 176,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        fontSize: 18,
        fontFamily: "JosefinSans_400Regular",
        color: "rgba(0, 0, 0, 0.5)",
        paddingVertical: 3,
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        marginVertical: 3,
    },
});
