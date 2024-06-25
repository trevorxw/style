import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { Image } from 'expo-image';
import * as ImagePicker from "expo-image-picker";
import { useUser, useClerk } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";

export default function EditProfileScreen() {
    const { isLoaded, user } = useUser();
    const [username, setUsername] = useState(user?.username);
    const [bio, setBio] = useState(user?.unsafeMetadata["bio"]);
    const [profileImage, setProfileImage] = useState(user?.imageUrl);
    const navigation = useNavigation();

    const handleSaveProfile = async () => {
        if (!user) {
            console.error("User context is not ready.");
            return;
        }

        try {
            await user.update({
                username: username,
                unsafeMetadata: {
                    bio,
                },
            });

            await user.reload();
        } catch (error) {
            console.error("Failed to update profile:", error.message);
        }
        navigation.navigate("profile-tab", { from: "settings" });
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            base64: true,
        });
        try {
            if (!result.canceled && result.assets[0].base64) {
                const base64 = result.assets[0].base64;
                const mimeType = result.assets[0].mimeType;

                const image = `data:${mimeType};base64,${base64}`;

                await user?.setProfileImage({
                    file: image,
                });

                await user.reload();
                navigation.navigate("profile-tab", { from: "settings" });
            }
        } catch (error) {
            console.error("Failed to update profile picture:", error);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={pickImage}
                    style={styles.imagePicker}
                >
                    {profileImage ? (
                        <Image
                            source={profileImage}
                            style={styles.profileImage}
                        />
                    ) : (
                        <Image
                            source={require("../../../assets/images/blank-profile-picture.png")}
                            style={styles.profileImage}
                        />
                    )}
                </TouchableOpacity>
                <Text>Profile Picture changes immediately.</Text>
                <Text>Username can only have letters, numbers, -, _</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setUsername}
                    placeholder={username ? username : "Set Username"}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setBio}
                    placeholder={bio ? bio : "currently obsessed with..."}
                />
                <TouchableOpacity
                    onPress={handleSaveProfile}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Save Profile</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f2f2f2",
    },
    imagePicker: {
        marginBottom: 20,
        justifyContent: "center",
        alignItems: "center",
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: "#dddddd",
    },
    profileImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        resizeMode: "cover",
    },
    input: {
        width: "80%",
        marginVertical: 10,
        padding: 15,
        borderWidth: 2,
        borderColor: "#007bff",
        borderRadius: 10,
        backgroundColor: "#ffffff",
        fontSize: 16,
    },
    button: {
        marginTop: 20,
        backgroundColor: "#007bff",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 18,
        textAlign: "center",
    },
});
