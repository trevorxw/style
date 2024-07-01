import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import useFetchUser from "../../../hooks/useFetchUser";

export const NotifCard = ({
    username,
    userDetails,
    isFollowing,
    onToggleFollow,
    loading,
    post_id,
    post,
}) => {
    navigation = useNavigation();
    const { user, error } = useFetchUser(userDetails.uid);

    // const handleNavigation = (destination, params) => {
    //     if (post) {
    //         navigation.navigate(destination, params);
    //         console.log(`Redirecting to ${JSON.stringify(post)}`)
    //     }
    // };

    return (
        <View style={styles.userContainer}>
            <TouchableOpacity
                style={styles.redirectContainer}
                onPress={() => {
                    navigation.navigate("profile", { user: user });
                }}
            >
                <Image
                    source={[
                        {
                            uri: userDetails.photo_url,
                            width: 50,
                            height: 50,
                            scale: 1,
                        },
                    ]}
                    style={styles.userImage}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.usernameStyle}>{username}</Text>
                    {post_id ? (
                        <Text style={styles.text}>liked your post</Text>
                    ) : (
                        <Text style={styles.text}>started following you</Text>
                    )}
                </View>
            </TouchableOpacity>
            {post_id ? (
                <TouchableOpacity>
                    <Image source={post?.url} style={styles.image} />
                </TouchableOpacity>
            ) : isFollowing ? (
                <TouchableOpacity
                    style={styles.followingButton}
                    onPress={() => onToggleFollow(username, userDetails.uid)}
                    disabled={loading}
                >
                    <Text style={styles.followingText}>Following</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => onToggleFollow(username, userDetails.uid)}
                    disabled={loading}
                >
                    <Text style={styles.addText}>Add</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    userContainer: {
        flexDirection: "row",
        marginBottom: 15,
        alignItems: "center",
    },
    userImage: {
        height: 60,
        width: 60,
        borderRadius: 60,
        marginRight: 20,
    },
    textContainer: {
        width: 160,
        textAlign: "center",
    },
    redirectContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    usernameStyle: {
        fontFamily: "JosefinSans_700Bold",
        fontSize: 16,
        marginBottom: 2,
    },
    text: {
        fontFamily: "JosefinSans_400Regular",
        fontSize: 14,
    },
    addButton: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#45B0FF",
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 6,
        width: 85,
        height: 35,
    },
    followingButton: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#D9D9D9",
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 6,
        width: 85,
        height: 35,
    },
    followingText: {
        fontSize: 16,
        fontFamily: "JosefinSans_700Bold",
        color: "black",
    },
    addText: {
        fontSize: 16,
        fontFamily: "JosefinSans_700Bold",
        color: "white",
    },
    image: {
        backgroundColor: "#D9D9D9",
        borderRadius: 6,
        height: 50,
        width: 50,
        marginLeft: 35,
    },
});
