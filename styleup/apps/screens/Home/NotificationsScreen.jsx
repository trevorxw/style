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
import { getFirebaseToken } from "../../../utils";
import { NotifCard } from "../../components/NotificationsScreen/NotifCard";
import useLikesData from "../../../hooks/useLikesData";

export default function NotificationsScreen({ route }) {
    const { user } = route.params;
    let [fontsLoaded] = useFonts({
        JosefinSans_700Bold,
        JosefinSans_100Thin,
    });
    const [userPosts, setUserPosts] = useState(null);
    const [userData, setUserData] = useState({});
    const [usernames, setUsernames] = useState({});
    const { likesData, loading, refreshLikesData } = useLikesData(user.id);
    const [following, setFollowing] = useState(user?.following || {});
    const [activity, setActivity] = useState({ today: [], previous: [] });
    

    useEffect(() => {
        if (user) {
            retrieveUsernames();
            retrieveUsernameData();
            refreshLikesData();
        }
    }, [user]);
    useEffect(() => {
        if (user) {
            partitionActivity();
        }
        getUserPosts();
    }, [likesData]);

    const retrieveUsernames = async () => {
        try {
            const token = await getFirebaseToken();
            const response = await fetch(
                "https://fitpic-flask-ys4dqjogsq-wl.a.run.app/usernames/id",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const usernameData = await response.json();
            setUsernames(usernameData);
        } catch (error) {
            console.error("Error fetching usernames", error);
        }
    };

    const retrieveUsernameData = async () => {
        try {
            const token = await getFirebaseToken();
            const response = await fetch(
                "https://fitpic-flask-ys4dqjogsq-wl.a.run.app/usernames/data",
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

    const getUserPosts = async () => {
        const posts = {};

        // Fetch details for each post using the post ID
        const token = await getFirebaseToken();
        for (const like of likesData) {
            try {
                const response = await fetch(
                    `https://fitpic-flask-ys4dqjogsq-wl.a.run.app/cards/${like.post_id}`,{
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const postData = await response.json();
                if (postData) {
                    posts[like.post_id] = postData;
                }
            } catch (error) {
                console.error("Error fetching post data", error);
            }
        }
        setUserPosts(posts);
    };

    const partitionActivity = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const newActivity = { today: [], previous: [] };
        if (user.followers) {
            Object.keys(user.followers).forEach((username) => {
                const details = user.followers[username];
                const followDate = new Date(details.createdAt);
                const data = {
                    username: username,
                    post_id: null,
                    created_at: details.createdAt,
                };
                if (followDate >= today) {
                    newActivity.today.push(data);
                } else {
                    newActivity.previous.push(data);
                }
            });
        }
        if (likesData) {
            Object.values(likesData).forEach((like) => {
                const followDate = new Date(like.created_at);
                const data = {
                    username: usernames[like.user_id],
                    post_id: like.post_id,
                    created_at: like.created_at,
                };
                if (followDate >= today) {
                    newActivity.today.push(data);
                } else {
                    newActivity.previous.push(data);
                }
            });
        }
        activity.today.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        activity.previous.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setActivity(newActivity);
    };

    const toggleFollow = async (username, uid) => {
        setLoading(true);
        try {
            // Determine if the user is currently followed to either follow or unfollow
            const currentlyFollowing = !!following[username];
            const token = await getFirebaseToken();
            const response = await fetch(
                `https://fitpic-flask-ys4dqjogsq-wl.a.run.app/follow/${user.id}/${uid}`,
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

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.placeholder}></View>
                <Text style={styles.headerText}>notifications</Text>
                <View style={styles.placeholder}></View>
            </View>
            <ScrollView style={styles.containerScroll}>
                {["today", "previous"].map((section) => (
                    <View key={section} style={styles.section}>
                        <Text style={styles.sectionHeader}>{section}</Text>
                        {activity[section].map((data) => (
                            <View style={styles.profile}>
                                <NotifCard
                                    key={data.username}
                                    username={data.username}
                                    userDetails={userData?.[data.username] || {}}
                                    isFollowing={!!following[data.username]}
                                    onToggleFollow={toggleFollow}
                                    loading={loading}
                                    post_id={data.post_id}
                                    post={userPosts?.[data.post_id]}
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
    container: {
        marginTop: 50,
    },
    headerText: {
        fontSize: 30,
        textAlign: "center",
        fontWeight: "bold",
        fontFamily: "JosefinSans_700Bold",
        color: "black",
        padding: 1,
    },
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
