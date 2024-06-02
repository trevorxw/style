import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

export default function ProfilePicture({ user }) {
    const navigation = useNavigation();
    return (
        <View>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate("profile", { user: user});
                }}
            >
                <Image
                    source={{ uri: user.image_url }}
                    style={styles.profileImage}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    profileImage: {
        marginBottom: 20,
        width: 38, // Tailwind w-[120px]
        height: 38, // Tailwind h-[120px]
        borderRadius: 60, // Tailwind rounded-full
        borderWidth: 2,
        borderColor: "white",
    },
});
