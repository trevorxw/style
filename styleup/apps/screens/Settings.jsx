import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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
        <View style={styles.container}>
            {/* Other settings options can go here */}
            {/* Logout button at the bottom */}
            <LogoutButton style={{ justifyContent: "center" }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        alignItems: "center",
        padding: 20,
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        marginTop: 25,
        marginBottom: 20,
        fontFamily: "JosefinSans_400Regular",
    },
});
