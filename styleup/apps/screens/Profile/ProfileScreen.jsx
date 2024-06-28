import React, { useContext, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    useWindowDimensions,
    ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { AuthenticatedUserContext } from "../../providers";
import { Feather } from "@expo/vector-icons";
import Followers from "../../components/ProfileScreen/Followers";
import Following from "../../components/ProfileScreen/Following";
import { TabView, TabBar } from "react-native-tab-view";
import Posts from "../../components/ProfileScreen/Posts";
import Swipes from "../../components/ProfileScreen/Swipes";
import Collection from "../../components/ProfileScreen/Collection";
import Ootd from "../../components/ProfileScreen/Ootd";
import {
    useRoute,
    useNavigation,
    useIsFocused,
} from "@react-navigation/native";
import useFetchUser from "../../../hooks/useFetchUser";
import {
    useFonts,
    JosefinSans_400Regular,
} from "@expo-google-fonts/josefin-sans";

export default function ProfileScreen() {
    const isFocused = useIsFocused();
    let [fontsLoaded] = useFonts({
        JosefinSans_400Regular,
    });
    const layout = useWindowDimensions();
    const route = useRoute();
    const navigation = useNavigation();

    const { user: userFirebase } = useContext(AuthenticatedUserContext);
    const { user, loadingUser, error, refreshUserData } = useFetchUser(
        userFirebase.uid
    );

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: "posts", title: "posts" },
        { key: "swipes", title: "swipes" },
        { key: "collection", title: "collection" },
        { key: "ootd", title: "ootd" },
    ]);

    const renderScene = ({ route }) => {
        switch (route.key) {
            case "posts":
                return <Posts style={styles.posts} user={user} />;
            case "swipes":
                return <Swipes style={styles.posts} user={user} />;
            case "collection":
                return <Collection style={styles.posts} user={user} />;
            case "ootd":
                return <Ootd style={styles.posts} user={user} />;
            default:
                return null;
        }
    };

    useEffect(() => {
        // Check if the screen is focused and if navigation came from the 'Settings' page
        if (
            isFocused &&
            (route.params?.from === "settings" ||
                route.params?.from === "AddPost" ||
                route.params?.from === "edited collection" ||
                route.params?.from === "add collection" ||
                route.params?.from === "ootd")
        ) {
            refreshUserData();
            route.params.from = undefined;
        }
    }, [isFocused, route.params, refreshUserData]);

    if (loadingUser) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#00ffff" />
            </View>
        );
    }
    if (!user) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#00ffff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.placeholder}></View>
                <View style={styles.placeholder}></View>
                <TouchableOpacity
                    onPress={() => navigation.navigate("settings")}
                    style={styles.settingsButton}
                >
                    <Feather name="settings" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <View style={styles.profileSection}>
                <Image source={user.image_url} style={styles.profileImage} />
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
            <View style={styles.subheader}>
                <View style={styles.editProfileSection}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("edit profile")}
                        style={styles.editProfileButton}
                    >
                        <Text style={styles.editProfileButtonText}>
                            edit profile
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.followSection}>
                    <Followers user={user} />
                    <Following user={user} />
                </View>
            </View>

            {/* Edit Profile Section to be completed */}

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
    header:{
        marginTop: 50,
        marginBottom: 5,
        height: 24,
        flexDirection: 'center',
        justifyContent:'space-between',
        marginRight: 20,
    },
    placeholder:{
        width: 24,
    },
    settingsButton: {
        justifyContent: "flex-end",
        zIndex: 10, // Tailwind z-1
        
    },
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    profileSection: {
        flexDirection: "row",
        marginTop: 0,
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
    subheader: {
        flexDirection: "row",
        marginLeft: 24,
        alignItems: "center",
    },
    editProfileButton: {
        backgroundColor: "#D9D9D9",
        borderRadius: 2,
        width: 120,
        alignItems: "center",
        padding: 6,
        margin: 2,
    },
    editProfileButtonText: {
        fontSize: 20,
        fontFamily: "JosefinSans_400Regular",
    },
    settingsButton: {
        position: "absolute",
        right: "0%",
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
        marginLeft: 12,
        padding: 2,
    },
    posts: {
        borderColor: "black",
        borderWidth: 2,
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
