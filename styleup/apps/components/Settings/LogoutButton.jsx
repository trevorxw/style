import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useClerk } from "@clerk/clerk-expo";

export default function LogoutButton() {
    const { signOut } = useClerk();

    const handleLogout = async () => {
        try {
            await signOut(); // Make sure to implement your sign-out logic here
        } catch (error) {
            console.error("Logout failed:", error);
        }
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
    },
});
