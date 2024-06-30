import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import {
    useFonts,
    JosefinSans_700Bold,
    JosefinSans_100Thin,
} from "@expo-google-fonts/josefin-sans";
import { Image } from "expo-image";
import { ProfileFollowing } from "./ProfileFollowing";
import { getFirebaseToken } from "../../../utils";

export default function FollowHistory({ user }) {
    let [fontsLoaded] = useFonts({
        JosefinSans_700Bold,
        JosefinSans_100Thin,
    });

    const [userData, setUserData] = useState({});
    const [following, setFollowing] = useState(user?.following || {});
    const [followers, setFollowers] = useState({ today: [], previous: [] });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            retrieveUsernameData();
            partitionFollowers();
        }
    }, [user]);

    const retrieveUsernameData = async () => {
        try {
            const token = await getFirebaseToken();
            const response = await fetch(
                "https://1c3f-2600-1700-3680-2110-c5e1-68dc-a20a-4910.ngrok-free.app/usernames/data",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const userData = await response.json();
            delete userData[user.username];
            console.log(userData);
            setUserData(userData);
        } catch (error) {
            console.error("Error fetching user data", error);
        }
    };

    const partitionFollowers = () => {
        if (!user?.followers) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const newFollowers = { today: [], previous: [] };
        if (user.followers) {
            Object.keys(user.followers).forEach((username) => {
                const details = user.followers[username];
                const followDate = new Date(details.createdAt);
                if (followDate >= today) {
                    newFollowers.today.push(username);
                } else {
                    newFollowers.previous.push(username);
                }
            });
        }
        setFollowers(newFollowers);
    };

    const toggleFollow = async (username, uid) => {
        setLoading(true);
        try {
            // Determine if the user is currently followed to either follow or unfollow
            const currentlyFollowing = !!following[username];
            const token = await getFirebaseToken();
            const response = await fetch(
                `https://1c3f-2600-1700-3680-2110-c5e1-68dc-a20a-4910.ngrok-free.app/follow/${user.id}/${uid}`,
                {
                    method: currentlyFollowing ? "DELETE" : "POST", // Assuming DELETE to unfollow and POST to follow
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            // Toggle the following state based on current state
            setFollowing((prev) => ({
                ...prev,
                [username]: !currentlyFollowing,
            }));
        } catch (error) {
            console.error("Error updating user follow", error);
        }
        setLoading(false);
    };

    console.log("HERE", followers["today"]);
    console.log(userData["trev.wong"]);

    return (
        <View style={styles.container}>
            <View style={styles.descContainer}>
                <Text style={styles.descText}>
                    to see each other's ootds, you and the other user must
                    follow each other
                </Text>
            </View>
            <ScrollView style={styles.containerScroll}>
                {["today", "previous"].map((section) => (
                    <View key={section} style={styles.section}>
                        <Text style={styles.sectionHeader}>{section}</Text>
                        {followers[section].map((username) => (
                            <View style={styles.profile}>
                                <ProfileFollowing
                                    key={username}
                                    username={username}
                                    userDetails={userData[username] || {}}
                                    isFollowing={!!following[username]}
                                    onToggleFollow={toggleFollow}
                                    loading={loading}
                                />
                            </View>
                        ))}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
    containerScroll: {
        marginHorizontal: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    textContainer: {
        marginRight: 70,
    },
    descContainer: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#CFE8FF",
        paddingVertical: 10,
        marginTop: 10,
    },
    descText: {
        fontFamily: "JosefinSans_400Regular",
        fontSize: 14,
        textAlign: "center",
        marginHorizontal: 40,
    },
    containerScroll: {
        marginHorizontal: 10,
    },
    section: {
        marginBottom: 15,
    },
    sectionHeader: {
        margin: 10,
        fontFamily: "JosefinSans_700Bold",
        fontSize: 22,
    },
    profile: {
        alignItems: "center",
        justifyContent: "center",
    },
});
