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
import { useRoute } from "@react-navigation/native";
import useFetchUser from "../../hooks/useFetchUser";
import Followers from "../components/ProfileScreen/Followers";
import Following from "../components/ProfileScreen/Following";
import Posts from "../components/ProfileScreen/Posts";

export default function OtherProfileScreen() {
    const layout = useWindowDimensions();
    const route = useRoute();
    const { user } = route.params;

    return (
        <View style={styles.container}>
            <View style={styles.profileSection}>
                <Image
                    source={{ uri: user.image_url }}
                    style={styles.profileImage}
                />
                <View style={styles.profileInfo}>
                    <View style={styles.profileText}>
                        <Text style={styles.userName}>@{user.username}</Text>
                        <Text style={styles.userBio}>trevor | 😃😃😃😃</Text>
                        <View style={styles.insContainer}>
                            <Text style={styles.insTitle}>INS:</Text>
                            <Text style={styles.insDescription}>
                                currently obsessed with...
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.followSection}>
                <Followers user={user} />
                <Following user={user} />
            </View>
            {/* Edit Profile Section to be completed */}
            {/* <View style={styles.editProfileSection}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("edit-profile")}
                    style={styles.editProfileButton}
                >
                    <Text style={styles.editProfileButtonText}>
                        edit profile
                    </Text>
                </TouchableOpacity>
            </View> */}
            <Posts style={styles.posts} user={user} />
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
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 20,
        marginRight: 20,
        padding: 2,
    },
});
