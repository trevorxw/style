import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
} from "react-native";
import React, { useContext, useCallback, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import { useWarmUpBrowser } from "../../../hooks/useWarmUpBrowser";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import {
    useFonts,
    JosefinSans_400Regular,
    JosefinSans_700Bold,
} from "@expo-google-fonts/josefin-sans";
import { AuthenticatedUserContext } from "../../providers";
// import * as Google from "expo-auth-session/providers/google";
// import { auth, iosClientId, expoClientId } from "../../../firebaseConfig";

WebBrowser.maybeCompleteAuthSession();

export default function OptionsScreen() {
    // const [ request, response, promptAsync ] = Google.useAuthRequest({
    //     expoClientId: expoClientId,
    //     iosClientId: iosClientId,
    // });
    let [fontsLoaded] = useFonts({
        JosefinSans_400Regular,
        JosefinSans_700Bold,
    });
    useWarmUpBrowser();
    const { login } = useContext(AuthenticatedUserContext);
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>fitpic</Text>
            <Text style={styles.description}>a world of fashion awaits</Text>
            {/* <Text style={styles.forgotPassword}>forgot password?</Text> */}
            {/* <TouchableOpacity style={styles.button} onPress={promptAsync}>
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
                <Text style={styles.dividerText}>OR</Text>
            </View> */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    navigation.navigate("login");
                }}
            >
                <Feather name="mail" size={24} color="white" />
                <Text style={styles.buttonText}>sign in with email</Text>
                <View style={styles.placeholder}></View>
            </TouchableOpacity>
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
        fontSize: 60,
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
    button: {
        backgroundColor: "#45B0FF",
        height: 50,
        width: "90%",
        paddingHorizontal: 15,
        borderRadius: 10,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    buttonGoogleText: {
        color: "white",
        fontSize: 18,
        fontFamily: "JosefinSans_700Bold",
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontFamily: "JosefinSans_700Bold",
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
    dividerText: {
        fontSize: 15,
        color: "#B3B2B2",
        fontFamily: "JosefinSans_400Regular",
        marginVertical: 20,
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
