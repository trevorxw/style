import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import useFetchUser from "../../../hooks/useFetchUser";

export const ProfileFollowing = ({ username, userDetails, isFollowing, onToggleFollow, loading }) => {
    navigation = useNavigation()
    const { user, error } = useFetchUser(userDetails.uid);
    return (
        <View style={styles.userContainer}>
            <TouchableOpacity style={styles.redirectContainer} onPress={()=>{
                navigation.navigate('profile', { user: user })
            }}>
            <Image
                source={userDetails.photo_url}
                style={styles.userImage}
            />
            <View style={styles.textContainer}>
                <Text style={styles.usernameStyle}>{username}</Text>
                <Text style={styles.name}>{userDetails.display_name}</Text>
            </View>
            </TouchableOpacity>
            {isFollowing ? (
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
        marginRight: 70,
    },
    redirectContainer:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    usernameStyle: {
        fontFamily: "JosefinSans_700Bold",
        fontSize: 16,
        marginBottom: 2,
    },
    name: {
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
});