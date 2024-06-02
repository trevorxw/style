import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useUser, useClerk } from "@clerk/clerk-expo";

export default function EditProfileScreen({ navigation }) {
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const { user, setUser } = useUser();
    const clerk = useClerk();

    useEffect(() => {
        if (user) {
            setUsername(user.username || "");
            setBio(user.bio || "");
            setProfileImage(user.profileImageUrl || null);
        }
    }, [user]);

    const handleSaveProfile = async () => {
        if (!clerk || !user) {
            console.error("Clerk or user context is not ready.");
            return;
        }

        try {
            await clerk.users.updateProfile(user.id, {
                username,
                publicMetadata: { bio },
            });
            if (profileImage) {
                // Code to handle profile image upload goes here
            }
            setUser({ ...user, username, bio });
            navigation.navigate("Main");
        } catch (error) {
            console.error("Failed to update profile:", error);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.cancelled) {
            setProfileImage(result.uri);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                {profileImage ? (
                    <Image
                        source={{ uri: profileImage }}
                        style={styles.profileImage}
                    />
                ) : (
                    <Text>Select Image</Text>
                )}
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                onChangeText={setUsername}
                value={username}
                placeholder="Username"
            />
            <TextInput
                style={styles.input}
                onChangeText={setBio}
                value={bio}
                placeholder="Bio"
                multiline
            />
            <TouchableOpacity onPress={handleSaveProfile} style={styles.button}>
                <Text style={styles.buttonText}>Save Profile</Text>
            </TouchableOpacity>
        </View>
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
        width: "100%",
        height: "100%",
        borderRadius: 50,
        resizeMode: 'cover'
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
