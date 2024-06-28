import React, { useContext } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { auth } from "../../../firebaseConfig";
import { signOut } from "firebase/auth";
import {
    useFonts,
    JosefinSans_400Regular,
} from "@expo-google-fonts/josefin-sans";

export default function LogoutButton() {
    let [fontsLoaded] = useFonts({
        JosefinSans_400Regular,
    });

    const handleLogout = () => {
        signOut(auth).catch((error) => console.log("Error logging out: ", error));
      };
    return (
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.text}>Logout</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#007bff", // A nice shade of blue
        padding: 10,
        borderRadius: 20, // Rounded corners
        alignItems: "center", // Center-align text
        justifyContent: "center", // Center vertically
        shadowOpacity: 0.3, // Add shadow for a "fancy" effect
        shadowRadius: 5,
        shadowColor: "#000",
        shadowOffset: { height: 2, width: 0 },
        elevation: 3, // Elevation for Android shadow
        width: 200, // Fixed width for consistency
        height: 50, // Fixed height for consistency
    },
    text: {
        color: "white", // White text color
        fontWeight: "bold", // Bold font weight
        fontSize: 16, // Slightly larger font size
        fontFamily: "JosefinSans_400Regular",
    },
});
