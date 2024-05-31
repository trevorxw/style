import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";
import LogoutButton from "../components/Settings/LogoutButton";

export default function Settings() {
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
        alignItems: 'center',
        
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 20, // Space below the header
    },
});
