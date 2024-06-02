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

export default function Settings() {
    const navigation = useNavigation();
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Other settings options can go here */}
            <Text style={styles.header}>Settings</Text>
            {/* Other components or settings elements */}
            {/* Edit User Profile */}
            {/* <View style={styles.editProfileSection}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("edit-profile")}
                    style={styles.editProfileButton}
                >
                    <Text style={styles.editProfileButtonText}>
                        Edit Profile
                    </Text>
                </TouchableOpacity>
            </View> */}
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
        marginBottom: 20, // Space below the header
    },
});
