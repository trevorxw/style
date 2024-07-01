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
import { getFirebaseToken } from "../../../utils";
import {
    useFonts,
    JosefinSans_400Regular,
    JosefinSans_700Bold,
} from "@expo-google-fonts/josefin-sans";

export default function UserCreationScreen() {
    const { user: userFirebase } = useContext(AuthenticatedUserContext);
    const { user, loadingUser, error, refreshUserData } = useFetchUser(
        userFirebase.uid
    );
    const [image, setImage] = useState(null);
    const [errorState, setErrorState] = useState("");
    const navigation = useNavigation();
    const [usernames, setUsernames] = useState(null);

    useEffect(() => {
        retrieveUsernames();
    }, []);

    const usernameValidationSchema = Yup.object().shape({
        username: Yup.string()
            .min(1, "username must be at least 1 character long")
            .test(
                "is-unique",
                "username not available",
                (value) => value && !(value in usernames) // Check if the set does not contain the username
            )
            .required("username is required"),
        name: Yup.string().required("name is required"),
        bio: Yup.string(),
    });

    const retrieveUsernames = async () => {
        try {
            const token = await getFirebaseToken();
            const response = await fetch(
                `https://fitpic-flask-ys4dqjogsq-wl.a.run.app/usernames`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const usernameData = await response.json();
            console.log(usernameData);
            setUsernames(usernameData);
        } catch (error) {
            console.error("Error fetching usernames", error);
        }
    };

    const handleSaveProfile = async (values) => {
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
            if (values.bio !== "") {
                formData.append("bio", values.bio);
            }
            formData.append("username", values.username);
            formData.append("name", values.name);
            // Post request to Flask endpoint
            const token = await getFirebaseToken();
            const response = await fetchWithTimeout(
                `https://fitpic-flask-ys4dqjogsq-wl.a.run.app/user/${userFirebase.uid}`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const result = await response.json();

            if (response.ok) {
                if (image) {
                    setImage(null);
                }
            } else {
                Alert.alert("Error", result.message || "An error occurred");
            }
        } catch (error) {
            console.error("Error uploading post", error);
            Alert.alert("Error", "Failed to edit profile.");
        }
    };

    const pickImage = async () => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert(
                "Give access to camera roll permissions to share your photos!"
            );
            return;
        }
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
                <View style={styles.container}>
                    <KeyboardAvoidingView
                        behavior="padding"
                        style={styles.form}
                    >
                        <View style={styles.headerContainer}>
                            <View style={styles.placeholder}></View>
                            <Text style={styles.headerText}>profile page</Text>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleSubmit}
                            >
                                <Feather
                                    name="check"
                                    size={30}
                                    color="#45B0FF"
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.imageContainer}>
                            <TouchableOpacity
                                onPress={pickImage}
                                style={styles.imagePicker}
                            >
                                {image ? (
                                    <Image
                                        source={image}
                                        style={styles.profileImage}
                                    />
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

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputTitleText}>username:</Text>
                            <View style={styles.usernameContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="enter a username"
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
                                    color={
                                        touched.username && errors.username
                                            ? "#FF6347"
                                            : "#45B0FF"
                                    }
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
                                placeholder="enter a name"
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
                            <View style={styles.textContainer}>
                                <Text style={styles.inputTitleText}>bio</Text>
                                <Text style={styles.inputTitleText}>:</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="enter a bio (optional)"
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
                    </KeyboardAvoidingView>
                </View>
            )}
        </Formik>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "white",
    },
    headerContainer: {
        width: "85%",
        marginTop: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: 15,
        marginBottom: 10,
        paddingTop: 2,
    },
    headerText: {
        fontSize: 30,
        color: "#45B0FF",
        textAlign: "center",
        fontWeight: "bold",
        fontFamily: "JosefinSans_700Bold",
    },
    placeholder: {
        width: 30,
        height: 24,
    },
    imageContainer: {
        backgroundColor: "white",
        marginVertical: 20,
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
    textContainer: {
        flexDirection: "row",
    },
    inputSmallText: {
        color: "black",
        fontSize: 10,
        fontFamily: "JosefinSans_400Regular",
        Bottom: 0,
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
