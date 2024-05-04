import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    useWindowDimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Followers from "../components/ProfileScreen/Followers";
import Following from "../components/ProfileScreen/Following";
import Posts from "../components/ProfileScreen/Posts";
import { TabView, TabBar } from "react-native-tab-view";
import { useNavigation } from "@react-navigation/native";

export default function OtherProfileScreen({ route }) {
    const { user } = route.params; // Assuming user data is passed as navigation parameter
    const layout = useWindowDimensions();
    const navigation = useNavigation();

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: "posts", title: "Posts" },
        { key: "followers", title: "Followers" },
        { key: "following", title: "Following" },
    ]);

    const renderScene = ({ route }) => {
        switch (route.key) {
            case "posts":
                return <Posts user={user} />;
            case "followers":
                return <Followers user={user} />;
            case "following":
                return <Following user={user} />;
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.profileSection}>
                <Image source={{ uri: user.imageUrl }} style={styles.profileImage} />
                <View style={styles.profileInfo}>
                    <View style={styles.profileText}>
                        <Text style={styles.userName}>@{user.fullName}</Text>
                        <Text style={styles.userBio}>{user.bio || "No bio available"}</Text>
                    </View>
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
                            <Text style={{ color, margin: 8 }}>{route.title}</Text>
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
});
