import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import React from "react";
import LogoutButton from "../components/Settings/LogoutButton";
import { useNavigation } from "@react-navigation/native";
import {
    useFonts,
    JosefinSans_400Regular,
} from "@expo-google-fonts/josefin-sans";

export default function Settings() {
    let [fontsLoaded] = useFonts({
        JosefinSans_400Regular,
    });
    const navigation = useNavigation();
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Other settings options can go here */}
            <Text style={styles.header}>Settings</Text>
            {/* Other components or settings elements */}
            {/* Logout button at the bottom */}
            <LogoutButton />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between", // Ensures the button can stick to the bottom
        padding: 20, // Padding around the container
        alignItems: "center",
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 20,
        fontFamily: "JosefinSans_400Regular",
    },
});
