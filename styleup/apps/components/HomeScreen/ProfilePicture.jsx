import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useContext } from "react";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { AuthenticatedUserContext } from "../../providers";

export default function ProfilePicture({ user }) {
    const navigation = useNavigation();
    const { user: userFirebase } = useContext(AuthenticatedUserContext);
    console.log(`Displaying profile picture for user: ${userFirebase.uid}`);
    return (
        <View>
            <TouchableOpacity
                onPress={() => {
                    if (user.id === userFirebase.uid) {
                        navigation.navigate("Profile");
                    } else {
                        navigation.navigate("profile", { user: user });
                    }
                }}
            >
                <Image
                    source={{
                        uri: user.image_url,
                        width: 38,
                        height: 38,
                        scale: 1,
                    }}
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
