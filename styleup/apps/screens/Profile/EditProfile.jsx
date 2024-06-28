import React, { useContext, useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ScrollView,
} from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { AuthenticatedUserContext } from "../../providers";
import { useNavigation } from "@react-navigation/native";
import useFetchUser from "../../../hooks/useFetchUser";
import { Formik } from "formik";
import { FormErrorMessage } from "../../components/LoginScreen/FormErrorMessage";
import { Feather } from "@expo/vector-icons";
import * as Yup from "yup";
import { fetchWithTimeout } from "../../../utils/fetchWithTimeout";

export default function EditProfileScreen() {
    const { user: userFirebase } = useContext(AuthenticatedUserContext);
    const { user, loadingUser, error, refreshUserData } = useFetchUser(
        userFirebase.uid
    );

    const [username, setUsername] = useState(user?.username);
    const [name, setName] = useState(user?.name);
    const [bio, setBio] = useState(user?.bio);
    const [profileImage, setProfileImage] = useState(user?.image_url);
    const [image, setImage] = useState(null);
    const [errorState, setErrorState] = useState("");
    const navigation = useNavigation();
    const [usernames, setUsernames] = useState(null);

    useEffect(() => {
        setProfileImage(user?.image_url);
    }, [user]);

    useEffect(() => {
        retrieveUsernames();
    }, []);

    const usernameValidationSchema = Yup.object().shape({
        username: Yup.string()
            .min(1, "username must be at least 1 character long")
            .test(
                "is-unique",
                "username not available",
                (value) => !usernames.has(value) // Check if the set does not contain the username
            ),
        name: Yup.string(),
        bio: Yup.string(),
    });

    const retrieveUsernames = async () => {
        try {
            const response = await fetch(
                `https://3cc7-2600-1700-3680-2110-c494-b15d-2488-7b57.ngrok-free.app/usernames`
            );
            const usernameData = await response.json();

            setUsernames(new Set(usernameData));
        } catch (error) {
            console.error("Error fetching usernames", error);
        }
    };

    const handleSaveProfile = async (values) => {
        if (
            image ||
            values.bio !== bio ||
            values.username !== username ||
            values.name !== name
        ) {
            try {
                // Create a FormData object to encapsulate the file data
                let formData = new FormData();
                if (image) {
                    formData.append("file", {
                        uri: image,
                        name: `${Date.now()}.jpg`,
                        type: "image/jpeg",
                    });
                }

                // Append other form values that you want to send along with the file
                if (values.bio !== bio) {
                    formData.append("bio", values.bio);
                }
                if (values.username !== username) {
                    formData.append("username", values.username);
                }
                if (values.name !== name) {
                    formData.append("name", values.name);
                }
                // Post request to Flask endpoint
                const response = await fetchWithTimeout(
                    `https://3cc7-2600-1700-3680-2110-c494-b15d-2488-7b57.ngrok-free.app/user/${userFirebase.uid}`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                const result = await response.json();

                if (response.ok) {
                    if (image) {
                        setImage(null);
                    }
                    Alert.alert("Success!", "Profile Edited Successfully.");
                    navigation.navigate("profile-tab", { from: "settings" });
                } else {
                    Alert.alert("Error", result.message || "An error occurred");
                }
            } catch (error) {
                console.error("Error uploading post", error);
                Alert.alert("Error", "Failed to edit profile.");
                navigation.navigate("profile-tab", { from: "settings" });
            }
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.2,
            base64: true,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <TouchableOpacity
                        onPress={pickImage}
                        style={styles.imagePicker}
                    >
                        {profileImage ? (
                            <Image
                                source={profileImage}
                                style={styles.profileImage}
                            />
                        ) : image ? (
                            <Image source={image} style={styles.profileImage} />
                        ) : (
                            <Image
                                source={require("../../../assets/images/blank-profile-picture.png")}
                                style={styles.profileImage}
                            />
                        )}
                    </TouchableOpacity>
                    {/* <Text style={styles.descriptionText}>
                        Profile Picture changes immediately.
                    </Text>
                    <Text style={styles.descriptionText}>
                        Username can only have letters, numbers, -, _
                    </Text> */}
                </View>
                <Formik
                    initialValues={{
                        username: user?.username,
                        name: user?.name,
                        bio: user?.bio,
                    }}
                    enableReinitialize={true}
                    validationSchema={usernameValidationSchema}
                    onSubmit={(values) => handleSaveProfile(values)}
                >
                    {({
                        values,
                        touched,
                        errors,
                        handleChange,
                        handleSubmit,
                        handleBlur,
                    }) => (
                        <KeyboardAvoidingView
                            behavior="padding"
                            style={styles.form}
                        >
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputTitleText}>
                                    username:
                                </Text>
                                <View style={styles.usernameContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={values.username}
                                        name="username"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        textContentType="name"
                                        onChangeText={handleChange("username")}
                                        onBlur={handleBlur("username")}
                                    />
                                    <Feather
                                        name="check-circle"
                                        size={22}
                                        color="#3BADFF"
                                        style={styles.check}
                                    />
                                </View>
                                <FormErrorMessage
                                    error={errors.username}
                                    visible={touched.username}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputTitleText}>name:</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder={values.name}
                                    name="name"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    textContentType="name"
                                    onChangeText={handleChange("name")}
                                    onBlur={handleBlur("name")}
                                />
                                <FormErrorMessage
                                    error={errors.name}
                                    visible={touched.name}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputTitleText}>bio:</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder={values.bio}
                                    name="bio"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    textContentType="bio"
                                    onChangeText={handleChange("bio")}
                                    onBlur={handleBlur("bio")}
                                />
                                <FormErrorMessage
                                    error={errors.bio}
                                    visible={touched.bio}
                                />
                            </View>
                            <TouchableOpacity
                                onPress={handleSubmit}
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>
                                    Save Profile
                                </Text>
                            </TouchableOpacity>
                        </KeyboardAvoidingView>
                    )}
                </Formik>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 20,
        backgroundColor: "white",
    },
    imageContainer: {
        backgroundColor: "white",
    },
    form: {
        width: "100%",
        alignItems: "center",
    },
    usernameContainer: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    check: {
        position: "absolute",
        right: 10,
    },
    imagePicker: {
        marginBottom: 20,
        alignItems: "center",
        width: 150,
        height: 150,
        borderRadius: 100,
        backgroundColor: "#dddddd",
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 100,
        contentFit: "cover",
    },
    input: {
        width: "100%",
        marginVertical: 10,
        padding: 15,
        borderWidth: 1.5,
        borderColor: "#3BADFF",
        borderRadius: 10,
        backgroundColor: "#ffffff",
        fontSize: 18,
        fontFamily: "JosefinSans_400Regular",
    },
    inputContainer: {
        width: "80%",
        marginBottom: 5,
    },
    inputTitleText: {
        color: "black",
        fontSize: 20,
        fontFamily: "JosefinSans_400Regular",
        marginBottom: -2,
    },
    button: {
        marginTop: 20,
        backgroundColor: "#3BADFF",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 18,
        textAlign: "center",
        fontFamily: "JosefinSans_400Regular",
    },
    descriptionText: {
        fontFamily: "JosefinSans_400Regular",
    },
});
