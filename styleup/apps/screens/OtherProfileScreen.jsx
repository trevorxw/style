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
import { TabView, TabBar } from "react-native-tab-view";
import {
    useFonts,
    JosefinSans_400Regular,
} from "@expo-google-fonts/josefin-sans";

export default function OtherProfileScreen() {
    let [fontsLoaded] = useFonts({
        JosefinSans_400Regular,
    });
    const layout = useWindowDimensions();
    const route = useRoute();
    const { user } = route.params;

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: "posts", title: "posts" },
        // { key: "swipes", title: "Swipes" },
        { key: "collection", title: "collection" },
        // { key: "wardrobe", title: "Wardrobe" },
    ]);

    const renderScene = ({ route }) => {
        switch (route.key) {
            case "posts":
                return <Posts style={styles.posts} user={user} />;
            // case "swipes":
            //     return <View style={{ flex: 1, backgroundColor: "#673ab7" }} />;
            case "collection":
                return <View style={{ flex: 1, backgroundColor: "white" }} />;
            // case "wardrobe":
            //     return <View style={{ flex: 1, backgroundColor: "#673ab7" }} />;
            default:
                return null;
        }
    };

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
                        <Text style={styles.userEmoji}>trevor | 😃😃😃😃</Text>
                        <View>
                            <Text style={styles.userBio}>
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
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                renderTabBar={(props) => (
                    <TabBar
                        {...props}
                        indicatorStyle={{ backgroundColor: "white" }}
                        style={{ backgroundColor: "#EFEFEF" }}
                        renderLabel={({ route, focused, color }) => (
                            <View
                                style={[
                                    styles.tabLabel,
                                    focused
                                        ? styles.focusedLabel
                                        : styles.unfocusedLabel,
                                ]}
                            >
                                <Text
                                    style={
                                        focused
                                            ? styles.focusedText
                                            : styles.unfocusedText
                                    }
                                >
                                    {route.title}
                                </Text>
                            </View>
                        )}
                    />
                )}
                lazy
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
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
        fontSize: 20,
        fontFamily: "JosefinSans_400Regular",
    },
    userBio: {
        marginTop: 4,
        fontSize: 15,
        fontFamily: "JosefinSans_400Regular",
    },
    userEmoji: {
        alignContent: "center",
        marginTop: 4,
        fontSize: 20,
        fontFamily: "JosefinSans_400Regular",
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
    focusedLabel: {
        flex: 1,
        // backgroundColor: "#CFE8FF", // Dark blue background when the tab is focused
        backgroundColor: "transparent",
        height: 30,
    },
    unfocusedLabel: {
        backgroundColor: "transparent", // Light grey background when the tab is not focused
    },

    focusedText: {
        color: "black",
        fontFamily: "JosefinSans_400Regular",
        fontSize: 19,
    },
    unfocusedText: {
        color: "#D9D9D9",
        fontFamily: "JosefinSans_400Regular",
        fontSize: 19,
    },
});
