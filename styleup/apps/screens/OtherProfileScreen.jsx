import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    useWindowDimensions,
    ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Followers from "../components/ProfileScreen/Followers";
import Following from "../components/ProfileScreen/Following";
import Posts from "../components/ProfileScreen/Posts";
import { TabView, TabBar } from "react-native-tab-view";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useRoute } from "@react-navigation/native";

export default function OtherProfileScreen() {
    const layout = useWindowDimensions();
    const route = useRoute();
    const userId = route.params?.user;
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchUser = async () => {
            if (!userId) {
                setError("No User ID provided");
                return;
            }
            try {
                const response = await axios.get(`https://46b3-2600-1700-3680-2110-4943-4220-72a0-761.ngrok-free.app/user/${userId}`);
                if (response.data && typeof response.data === "object") {
                    setUser(response.data);
                } else {
                    throw new Error("Received null or invalid user data");
                }
            } catch (error) {
                console.error("Failed to fetch user or process response", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#00ffff" />
            </View>
        );
    }
    if (!user) {
        return (
            <View style={styles.center}>
                <Text>No user data available.</Text>
            </View>
        );
    }
    console.log(user);
    return (
        <View style={styles.container}>
            <View style={styles.profileSection}>
                <Image
                    source={{ uri: user.image_url }}
                    style={styles.profileImage}
                />
                <View style={styles.profileInfo}>
                    <View style={styles.profileText}>
                        <Text style={styles.userName}>@{user.username || user.first_name + " " + user.last_name}</Text>
                        <Text style={styles.userBio}>
                            {user.bio || "No bio available"}
                        </Text>
                        <View style={styles.followSection}>
                            <Followers/>
                            <Following/>
                        </View>
                        <Posts user={user}/>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    profileSection: {
        flexDirection: "row",
        marginTop: 56,
        marginLeft: 24,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    profileInfo: {
        flex: 1,
        marginLeft: 20,
    },
    settingsButton: {
        position: "absolute",
        right: 0,
        zIndex: 10,
    },
    profileText: {
        marginTop: 32,
    },
    userName: {
        fontWeight: "bold",
        fontSize: 25,
    },
    userBio: {
        marginTop: 4,
        fontSize: 20,
    },
    followSection: {
        flex: 4 / 5,
        flexDirection: "row",
        justifyContent: "center",
    },
});
