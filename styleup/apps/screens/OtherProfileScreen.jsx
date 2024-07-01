import React, { useState, useEffect } from "react";
import {
    View,
    Text,
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
import Collection from "../components/ProfileScreen/Collection";
import Ootd from "../components/ProfileScreen/Ootd";
import { TabView, TabBar } from "react-native-tab-view";
import {
    useFonts,
    JosefinSans_400Regular,
} from "@expo-google-fonts/josefin-sans";
import { Image } from 'expo-image';

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
        // { key: "collection", title: "collection" },
        // { key: "ootd", title: "ootd" },
    ]);

    const renderScene = ({ route }) => {
        switch (route.key) {
            case "posts":
                return <Posts style={styles.posts} user={user} />;
            // case "swipes":
            //     return <View style={{ flex: 1, backgroundColor: "#673ab7" }} />;
            case "collection":
                return <Collection style={styles.posts} user={user} />;
            case "ootd":
                return <Ootd style={styles.posts} user={user} />;
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.profileSection}>
                <Image
                    source={user.image_url}
                    style={styles.profileImage}
                />
                <View style={styles.profileInfo}>
                <View style={styles.profileText}>
                        <Text style={styles.userName}>@{user.username}</Text>
                        <Text style={styles.name}>{user.name}</Text>
                        <View style={styles.divider}></View>
                        <View>
                            <Text style={styles.userBio}>
                                {user.bio == ""
                                    ? "currrently obsessed with..."
                                    : user.bio}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.followSection}>
                <Followers user={user} />
                <Following user={user} />
            </View>
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
        marginTop: 74,
        marginHorizontal: 24,
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
        alignItems: "center",
        marginTop: 10,
    },
    userName: {
        fontSize: 20,
        fontFamily: "JosefinSans_400Regular",
        marginBottom: 20,
    },
    name: {
        marginTop: 5,
        fontSize: 16,
        fontFamily: "JosefinSans_400Regular",
    },
    divider: {
        marginTop: 5,
        width: "100%",
        height: 1,
        backgroundColor: "#D9D9D9",
    },
    userBio: {
        marginTop: 10,
        fontSize: 15,
        fontFamily: "JosefinSans_400Regular",
    },
    followSection: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 0,
        marginBottom: 10,
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
