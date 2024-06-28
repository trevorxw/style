import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    KeyboardAvoidingView,
} from "react-native";
import { FormErrorMessage } from "../../components/LoginScreen/FormErrorMessage";
import React, { useState, useContext } from "react";
import * as WebBrowser from "expo-web-browser";
import { useNavigation } from "@react-navigation/native";

import { Feather } from "@expo/vector-icons";

// auth
import { auth } from "../../../firebaseConfig";
import { AuthenticatedUserContext } from "../../providers";
import { Formik } from "formik";
import { signInWithEmailAndPassword } from "firebase/auth";
import { loginValidationSchema } from "../../../utils";
import { useTogglePasswordVisibility } from "../../../hooks";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const navigation = useNavigation();
    const { login } = useContext(AuthenticatedUserContext);
    const [errorState, setErrorState] = useState("");
    const { passwordVisibility, handlePasswordVisibility, rightIcon } =
        useTogglePasswordVisibility();

    const handleLogin = (values) => {
        const { email, password } = values;
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up
                const user = userCredential.user;
                console.log("Logged in with:", user);
                login(user);
            })
            .catch((error) => setErrorState(error.message));
    };

    return (
        <View isSafe style={styles.container}>
            <Text style={styles.title}>fitpic</Text>
            <Text style={styles.description}>a world of fashion awaits</Text>
            <Formik
                initialValues={{
                    email: "",
                    password: "",
                }}
                validationSchema={loginValidationSchema}
                onSubmit={(values) => handleLogin(values)}
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
                        <TextInput
                            style={styles.input}
                            name="email"
                            leftIconName="email"
                            placeholder="email"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            textContentType="emailAddress"
                            // autoFocus={true}
                            value={values.email}
                            onChangeText={handleChange("email")}
                            onBlur={handleBlur("email")}
                        />
                        <FormErrorMessage
                            error={errors.email}
                            visible={touched.email}
                        />
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="password"
                                name="password"
                                leftIconName="key-variant"
                                autoCapitalize="none"
                                autoCorrect={false}
                                secureTextEntry={passwordVisibility}
                                textContentType="password"
                                rightIcon={rightIcon}
                                value={values.password}
                                onChangeText={handleChange("password")}
                                onBlur={handleBlur("password")}
                            />
                            {rightIcon ? (
                                <TouchableOpacity
                                    onPress={handlePasswordVisibility}
                                >
                                    <Feather
                                        name="eye"
                                        size={22}
                                        color="gray"
                                        style={styles.eye}
                                    />
                                </TouchableOpacity>
                            ) : null}
                        </View>
                        <FormErrorMessage
                            error={errors.password}
                            visible={touched.password}
                        />
                        {/* Error Message */}
                        {errorState !== "" ? (
                            <FormErrorMessage
                                error={errorState}
                                visible={true}
                            />
                        ) : null}
                        {/* Login Button */}
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.buttonText}>sign in</Text>
                        </TouchableOpacity>
                    </>
                )}
            </Formik>

            {/* <Text style={styles.forgotPassword}>forgot password?</Text> */}

            <View style={styles.registerContainer}>
                <Text style={styles.registerText}>new user? </Text>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate("registration");
                    }}
                >
                    <Text style={styles.registerButtonText}>Register Here</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#CFE8FF", // Light blue background
        padding: 20,
    },
    title: {
        paddingTop: 4,
        color: "#45B0FF",
        fontSize: 50,
        fontFamily: "JosefinSans_700Bold",
    },
    description: {
        paddingTop: 4,
        color: "white",
        fontSize: 15,
        marginBottom: 30,
        fontFamily: "JosefinSans_400Regular",
    },
    input: {
        height: 50,
        width: "80%",
        marginVertical: 10,
        borderWidth: 1,
        padding: 10,
        borderColor: "#fff", // White border for input
        backgroundColor: "#fff", // White background for input
        borderRadius: 10,
        fontSize: 16,
        fontFamily: "JosefinSans_700Bold",
    },
    forgotPassword: {
        color: "#000",
        marginVertical: 10,
        fontFamily: "JosefinSans_400Regular",
    },
    passwordContainer: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    eye: {
        position: "absolute",
        right: 10,
        bottom: -10,
    },
    button: {
        marginTop: 20,
        backgroundColor: "#45B0FF", // Google blue color
        width: "80%",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 22,
        fontFamily: "JosefinSans_700Bold",
    },
    registerText: {
        color: "white",
        fontSize: 16,
        fontFamily: "JosefinSans_400Regular",
    },
    registerButtonText: {
        color: "#3BADFF",
        fontSize: 16,
        fontFamily: "JosefinSans_400Regular",
    },
    registerContainer: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "center",
    },
});
