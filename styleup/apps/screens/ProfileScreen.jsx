import React from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    useWindowDimensions,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { Feather } from "@expo/vector-icons";
import Followers from "../components/ProfileScreen/Followers";
import Following from "../components/ProfileScreen/Following";
import { TabView, TabBar } from "react-native-tab-view";
import Posts from "../components/ProfileScreen/Posts";
import { useNavigation } from "@react-navigation/native";

const renderScene = ({ route }) => {
    switch (route.key) {
        case "posts":
            return <Posts />;
        case "swipes":
            return <View style={{ flex: 1, backgroundColor: "#673ab7" }} />;
        case "saved":
            return <View style={{ flex: 1, backgroundColor: "#673ab7" }} />;
        case "wardrobe":
            return <View style={{ flex: 1, backgroundColor: "#673ab7" }} />;
        default:
            return null;
    }
};

export default function ProfileScreen() {
    const layout = useWindowDimensions();
    const navigation = useNavigation();
    const { user } = useUser();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: "posts", title: "Posts" },
        { key: "swipes", title: "Swipes" },
        { key: "saved", title: "Saved" },
        { key: "wardrobe", title: "Wardrobe" },
    ]);

    return (
        <View style={styles.container}>
            <View style={styles.profileSection}>
                <Image
                    source={{ uri: user.imageUrl }}
                    style={styles.profileImage}
                />
                <View style={styles.profileInfo}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("settings")}
                        style={styles.settingsButton}
                    >
                        <Feather name="settings" size={24} color="black" />
                    </TouchableOpacity>
                    <View style={styles.profileText}>
                        <Text style={styles.userName}>@{user.fullName}</Text>
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
            <View style={styles.editProfileSection}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("edit-profile")}
                    style={styles.editProfileButton}
                >
                    <Text style={styles.editProfileButtonText}>
                        edit profile
                    </Text>
                </TouchableOpacity>
                <View style={styles.followSection}>
                    <Followers />
                    <Following />
                </View>
            </View>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                renderTabBar={(props) => (
                    <TabBar
                        {...props}
                        indicatorStyle={{ backgroundColor: "white" }}
                        style={{ backgroundColor: "pink" }}
                        renderLabel={({ route, focused, color }) => (
                            <Text style={{ color, margin: 8 }}>
                                {route.title}
                            </Text>
                        )}
                    />
                )}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    profileSection: {
        flexDirection: "row",
        marginTop: 56, // mt-14 in Tailwind
        marginLeft: 24, // ml-6 in Tailwind
    },
    profileImage: {
        width: 120, // Tailwind w-[120px]
        height: 120, // Tailwind h-[120px]
        borderRadius: 60, // Tailwind rounded-full
    },
    profileInfo: {
        flex: 7/8, // Tailwind w-3/5
    },
    settingsButton: {
        position: "absolute",
        right: 0, // Approximation of right-1 in Tailwind
        zIndex: 10, // Tailwind z-1
    },
    profileText: {
        marginLeft: 20, // ml-5 in Tailwind
    },
    userName: {
        marginTop: 32, // mt-8 in Tailwind
        fontWeight: "bold",
        fontSize: 25, // Tailwind text-[25px]
    },
    userBio: {
        marginLeft: 16, // ml-4 in Tailwind
        marginTop: 4, // mt-1 in Tailwind
        fontSize: 20, // Tailwind text-[20px]
    },
    insContainer: {
        flexDirection: "row",
        marginTop: 12, // mt-3 in Tailwind
    },
    insTitle: {
        fontWeight: "bold",
        fontSize: 20, // Tailwind text-[20px]
    },
    insDescription: {
        fontSize: 20, // Tailwind text-[20px]
    },
    editProfileSection: {
        flexDirection: "row",
        marginTop: 20, // mt-5 in Tailwind
        marginBottom: 20,
        alignItems: "center",
    },
    editProfileButton: {
        marginLeft: 24, // ml-6 in Tailwind
        borderWidth: 2, // Tailwind border-2
        borderRadius: 4, // Tailwind rounded-sm
        paddingVertical: 4, // Tailwind py-1
        paddingHorizontal: 0, // Adjusted for React Native
        width: 112, // Tailwind w-28
    },
    editProfileButtonText: {
        fontSize: 20, // Tailwind text-[20px]
        textAlign: "center",
    },
    followSection: {
        flex: 4 / 5, // Tailwind w-3/5
        flexDirection: "row",
        justifyContent: "center",
    },
});
