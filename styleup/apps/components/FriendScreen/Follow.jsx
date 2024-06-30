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
import { SearchBar } from "react-native-elements";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { ProfileFollowing } from "./ProfileFollowing";
import { getFirebaseToken } from "../../../utils";

export default function Follow({ user }) {
    let [fontsLoaded] = useFonts({
        JosefinSans_700Bold,
        JosefinSans_100Thin,
    });

    const [search, setSearch] = useState("");
    const [usernames, setUsernames] = useState(null);
    const [userData, setUserData] = useState(null);
    const [following, setFollowing] = useState(user.following || {});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            console.log("USER: ", user);
            retrieveUsernames();
            retrieveUsernameData();
        }
    }, [user]);

    const updateSearch = (search) => {
        setSearch(search);
    };

    const retrieveUsernames = async () => {
        try {
            const token = await getFirebaseToken();
            const response = await fetch(
                "https://1c3f-2600-1700-3680-2110-c5e1-68dc-a20a-4910.ngrok-free.app/usernames",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const usernameData = await response.json();
            // delete own uid
            delete usernameData[user.username];
            console.log(usernameData);
            setUsernames(usernameData);
        } catch (error) {
            console.error("Error fetching usernames", error);
        }
    };

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

    const filteredUsernames = search
        ? Object.keys(usernames).filter((username) =>
              username.toLowerCase().includes(search.toLowerCase())
          )
        : [];

    return (
        <View style={styles.container}>
            <SearchBar
                placeholder="search users by username"
                onChangeText={updateSearch}
                value={search}
                containerStyle={styles.searchContainer}
                inputContainerStyle={styles.searchInputContainer}
                searchIcon={<Feather name="search" color="#86939e" size={25} />}
                lightTheme
                inputStyle={{
                    fontFamily: "JosefinSans_400Regular", // Use the loaded font
                }}
            />
            <ScrollView style={styles.containerScroll}>
                {filteredUsernames.map((username) => (
                    <ProfileFollowing
                        key={username}
                        username={username}
                        userDetails={userData[username]}
                        isFollowing={!!following[username]}
                        onToggleFollow={toggleFollow}
                        loading={loading}
                    />
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 30,
    },
    containerScroll: {
        marginHorizontal: 10,
    },
    text: {
        fontSize: 17,
        textAlign: "center",
        fontFamily: "JosefinSans_100Thin",
    },
    searchContainer: {
        backgroundColor: "transparent",
        borderBottomColor: "transparent",
        borderTopColor: "transparent",
        marginBottom: 20,
    },
    searchInputContainer: {
        backgroundColor: "#fff",
    },
});
