import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Dimensions,
    Image,
    KeyboardAvoidingView,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useWarmUpBrowser } from "../../../hooks/useWarmUpBrowser";
import { Formik } from "formik";
import { Feather } from "@expo/vector-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FormErrorMessage } from "../../components/LoginScreen/FormErrorMessage";
import { auth } from "../../../firebaseConfig";
import { useTogglePasswordVisibility } from "../../../hooks";
import { signupValidationSchema } from "../../../utils";
import { useNavigation } from "@react-navigation/native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function RegistrationScreen() {
    useWarmUpBrowser();
    navigation = useNavigation();
    const [errorState, setErrorState] = useState("");

    const { passwordVisibility, confirmPasswordVisibility } =
        useTogglePasswordVisibility();

    const handleSignup = async (values) => {
        const { email, password } = values;

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log("Logged in with:", user);
                login(user);
            })
            .catch((error) => setErrorState(error.message));
    };

    const openWebBrowser = async (url) => {
        try {
            await WebBrowser.dismissBrowser();
            const result = await WebBrowser.openBrowserAsync(url);
        } catch (error) {
            console.error("Failed to open URL: ", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>fitpic registration</Text>
            <Text style={styles.description}>a world of fashion awaits</Text>
            {/* <TouchableOpacity style={styles.buttonGoogle}>
                <View style={styles.imageContainer}>
                    <Image
                        source={require("../../../assets/images/google-logo.png")}
                        style={styles.googleLogo}
                    />
                </View>
                <Text style={styles.buttonGoogleText}>
                    continue with Google
                </Text>
                <View style={styles.placeholder}></View>
            </TouchableOpacity>
            <View style={styles.divider}>
                <View style={styles.lines}></View>
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.lines}></View>
            </View> */}
            <Formik
                initialValues={{
                    email: "",
                    password: "",
                    confirmPassword: "",
                }}
                validationSchema={signupValidationSchema}
                onSubmit={(values) => handleSignup(values)}
            >
                {({
                    values,
                    touched,
                    errors,
                    handleChange,
                    handleSubmit,
                    handleBlur,
                }) => (
                    <>
                        <KeyboardAvoidingView
                            style={styles.bottomContainer}
                            behavior="padding"
                        >
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputTitleText}>
                                    email:
                                </Text>
                                <TextInput
                                    name="email"
                                    style={styles.input}
                                    placeholder="enter email"
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    textContentType="emailAddress"
                                    // autoFocus={true}
                                    value={values.email}
                                    onChangeText={handleChange("email")}
                                    onBlur={handleBlur("email")}
                                />
                                <FormErrorMessage
                                    style={styles.errorMessage}
                                    error={errors.email}
                                    visible={touched.email}
                                />
                            </View>
                            {/* <View style={styles.inputContainer}>
                                <Text style={styles.inputTitleText}>
                                    username:
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="enter your username"
                                />
                            </View> */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputTitleText}>
                                    password:
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    name="password"
                                    placeholder="enter password"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    secureTextEntry={passwordVisibility}
                                    textContentType="newPassword"
                                    value={values.password}
                                    onChangeText={handleChange("password")}
                                    onBlur={handleBlur("password")}
                                />

                                <FormErrorMessage
                                    error={errors.password}
                                    visible={touched.password}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputTitleText}>
                                    confirm password:
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    name="confirmPassword"
                                    placeholder="enter password"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    secureTextEntry={confirmPasswordVisibility}
                                    textContentType="password"
                                    value={values.confirmPassword}
                                    onChangeText={handleChange(
                                        "confirmPassword"
                                    )}
                                    onBlur={handleBlur("confirmPassword")}
                                />
                                <FormErrorMessage
                                    error={errors.confirmPassword}
                                    visible={touched.confirmPassword}
                                />
                            </View>
                            {/* Display Screen Error Messages */}
                            {errorState !== "" ? (
                                <FormErrorMessage
                                    error={errorState}
                                    visible={true}
                                />
                            ) : null}
                            <TouchableOpacity
                                style={styles.registerButton}
                                onPress={handleSubmit}
                            >
                                <Text style={styles.registerButtonText}>
                                    register
                                </Text>
                            </TouchableOpacity>
                        </KeyboardAvoidingView>
                    </>
                )}
            </Formik>

            <View style={styles.loginContainer}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate("login");
                    }}
                >
                    <Text style={styles.loginButtonText}>
                        Already have an account?
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                    By continuing, you agree to FitPic's
                    <TouchableOpacity
                        style={styles.clickableContainer}
                        onPress={() =>
                            openWebBrowser(
                                "https://docs.google.com/document/d/1KcB2yipns_UAqKoATryvAplVtjOInA685A3ejZxGVKU/edit?usp=sharing"
                            )
                        }
                    >
                        <Text style={styles.clickableText}>
                            Terms of Service
                        </Text>
                    </TouchableOpacity>
                    and confirm that you have read FitPic's
                    <TouchableOpacity
                        style={styles.clickableContainer}
                        onPress={() =>
                            openWebBrowser(
                                "https://docs.google.com/document/d/1EKjiTuZkLLfHtkR9rZbq2nJsIsoCXF7nyPisNxvwNp8/edit?usp=sharing"
                            )
                        }
                    >
                        <Text style={styles.clickableText}>Privacy Policy</Text>
                    </TouchableOpacity>
                    and
                    <TouchableOpacity
                        style={styles.clickableContainer}
                        onPress={() =>
                            openWebBrowser(
                                "https://docs.google.com/document/d/1QjQ7DxdWJkF8oZKYOndV2HAH-8jxR2Cj0apJUCkQz7c/edit?usp=sharing"
                            )
                        }
                    >
                        <Text style={styles.clickableText}>
                            Community Guidelines
                        </Text>
                    </TouchableOpacity>
                    .
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#CFE8FF", // Set a light background
    },
    bottomContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        paddingTop: 4,
        color: "#45B0FF",
        fontSize: 30,
        marginBottom: 2,
        fontFamily: "JosefinSans_700Bold",
    },
    description: {
        paddingTop: 4,
        color: "white",
        fontSize: 15,
        marginBottom: 30,
        fontFamily: "JosefinSans_400Regular",
    },
    buttonGoogle: {
        backgroundColor: "#45B0FF",
        borderRadius: 10,
        height: 50,
        width: "80%",
        paddingHorizontal: 15,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    googleLogo: {
        height: "140%",
        width: "140%",
    },
    imageContainer: {
        marginLeft: 1,
        height: 24,
        width: 24,
        justifyContent: "center",
        alignItems: "center",
    },
    placeholder: {
        width: 24,
    },
    buttonGoogleText: {
        color: "white",
        fontSize: 18,
        fontFamily: "JosefinSans_700Bold",
    },
    divider: {
        marginTop: 40,
        marginBottom: 30,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    lines: {
        height: 1,
        width: 150,
        marginHorizontal: 10,
        backgroundColor: "#B3B2B2",
    },
    dividerText: {
        fontSize: 15,
        color: "#B3B2B2",
        fontFamily: "JosefinSans_400Regular",
    },
    inputContainer: {
        width: "80%",
        marginBottom: 15,
    },
    inputTitleText: {
        color: "black",
        fontSize: 20,
        fontFamily: "JosefinSans_400Regular",
        marginBottom: 4,
    },
    input: {
        padding: 10,
        borderWidth: 1.5,
        borderColor: "#45B0FF", // Subtle border
        borderRadius: 4,
        marginBottom: 10,
        fontSize: 22,
        fontFamily: "JosefinSans_400Regular",
    },
    registerButton: {
        width: "80%",
        height: 40,
        backgroundColor: "#45B0FF", // Consistent with Google button
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    registerButtonText: {
        color: "white",
        fontSize: 18,
        fontFamily: "JosefinSans_700Bold",
    },
    loginButtonText: {
        color: "#3BADFF",
        fontSize: 16,
        fontFamily: "JosefinSans_400Regular",
    },
    loginContainer: {
        marginTop: 15,
        flexDirection: "row",
        justifyContent: "center",
    },
    termsContainer: {
        flexDirection: "row",
        alignItems: "baseline",
        justifyContent: "center",
        width: "80%",
        marginTop: 20,
    },
    clickableText: {
        fontSize: 12,
        fontFamily: "JosefinSans_400Regular",
        color: "#45B0FF",
        bottom: -3,
        marginHorizontal: 4,
    },
    clickableContainer: {},
    termsText: {
        fontSize: 12,
        fontFamily: "JosefinSans_400Regular",
        textAlign: "center",
    },
});
