import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    useWindowDimensions,
    TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { TabBar, TabView } from "react-native-tab-view";
import {
    useFonts,
    JosefinSans_400Regular,
    JosefinSans_700Bold,
} from "@expo-google-fonts/josefin-sans";
import { Feather } from "@expo/vector-icons";
import Follow from "../../components/FriendScreen/Follow";
import FollowHistory from "../../components/FriendScreen/FollowHistory";

export default function FriendScreen({ route }) {
    
    const { user } = route.params;
    const layout = useWindowDimensions();
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: "follow", title: "follow others" },
        { key: "followers", title: "followed you" },
    ]);

    const renderScene = ({ route }) => {
        switch (route.key) {
            case "follow":
                return <Follow user={user}/>;
            case "followers":
                return <FollowHistory user={user}/>;

            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                renderTabBar={(props) => (
                    <View style={styles.tabBarContainer}>
                        <TabBar
                            {...props}
                            indicatorStyle={styles.indicatorStyle}
                            style={{ backgroundColor: "transparent" }}
                            renderLabel={({ route, focused, color }) => (
                                <View style={[styles.focusedLabel]}>
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
                    </View>
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
        marginTop: 50,
    },
    tabBarContainer: {
        justifyContent: "space-between",
        backgroundColor: "transparent",
        zIndex: 1,
    },
    indicatorStyle: {
        backgroundColor: "black",
        width: 85,
        bottom: 17,
        justifyContent: "center",
        marginHorizontal: 55,
        borderRadius: 5,
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
        fontFamily: "JosefinSans_700Bold",
        fontSize: 19,
    },
    unfocusedText: {
        color: "#D9D9D9",
        fontFamily: "JosefinSans_700Bold",
        fontSize: 19,
    },
    iconButton: {
        paddingHorizontal: 20,
    },
});
