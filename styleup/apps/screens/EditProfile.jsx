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
import { useNavigation } from "@react-navigation/native";

export default function EditProfileScreen() {
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const { user, setUser } = useUser();
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUser = async () => {
            if (!userId) {
                setError("No User ID provided");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(
                    `https://3cc7-2600-1700-3680-2110-c494-b15d-2488-7b57.ngrok-free.app/user/${userId}`
                );
                if (response.data && typeof response.data === "object") {
                    setUser(response.data);
                } else {
                    throw new Error("Received null or invalid user data");
                }
            } catch (error) {
                console.error(
                    "Failed to fetch user or process response",
                    error
                );
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [profileImage]); // Dependency array ensures the effect runs only when userId changes

    useEffect(() => {
        if (user) {
            setUsername(user.username || "");
            setBio(user.bio || "");
            setProfileImage(user.profileImageUrl || null);
        }
    }, [user]);

    const handleSaveProfile = async () => {
        if (!user) {
            console.error("User context is not ready.");
            return;
        }

        try {
            if (profileImage) {
                // Code to handle profile image upload goes here
            }
            navigation.navigate("profile-tab");
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
