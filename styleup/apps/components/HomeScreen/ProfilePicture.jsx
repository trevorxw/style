import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

export default function ProfilePicture({ card }) {
    const navigation = useNavigation();
    return (
        <View>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate("profile", { user: card.userId });
                }}
            >
                <Image
                    source={{ uri: card.userImage }}
                    style={styles.profileImage}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    profileImage: {
        marginBottom: 20,
        width: 44, // Tailwind w-[120px]
        height: 44, // Tailwind h-[120px]
        borderRadius: 60, // Tailwind rounded-full
        borderWidth: 2,
        borderColor: "white",
    },
});
