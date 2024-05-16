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
import useFetchUser from '../../hooks/useFetchUser';
import Followers from "../components/ProfileScreen/Followers";
import Following from "../components/ProfileScreen/Following";
import Posts from "../components/ProfileScreen/Posts";

export default function OtherProfileScreen() {
    const layout = useWindowDimensions();
    const route = useRoute();
    const userId = route.params?.user;

    const { user, loading, error } = useFetchUser(userId);

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
                        <Text style={styles.userName}>@{user.username}</Text>
                        <Text style={styles.userBio}>
                            {user.bio || "No bio available"}
                        </Text>
                        <View style={styles.followSection}>
                            <Followers user={user}/>
                            <Following user={user}/>
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
        borderWidth: 2,
        borderColor: 'black',
    },
});
