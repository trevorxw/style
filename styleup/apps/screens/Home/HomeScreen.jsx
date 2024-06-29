import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    useWindowDimensions,
    TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import Discover from "../../components/HomeScreen/Discover";
import Ootd from "../../components/HomeScreen/Ootd";
import { app } from "../../../firebaseConfig";
import { getFirestore, getDocs, collection } from "firebase/firestore";
import { TabBar, TabView } from "react-native-tab-view";
import {
    useFonts,
    JosefinSans_400Regular,
    JosefinSans_700Bold,
} from "@expo-google-fonts/josefin-sans";
import { Feather } from "@expo/vector-icons";

export default function HomeScreen() {
    let [fontsLoaded] = useFonts({
        JosefinSans_400Regular,
        JosefinSans_700Bold,
    });
    const layout = useWindowDimensions();
    const [index, setIndex] = React.useState(1);
    const [routes] = React.useState([
        { key: "ootd", title: "ootd" },
        { key: "posts", title: "posts" },
    ]);

    const renderScene = ({ route }) => {
        switch (route.key) {
            case "ootd":
                return <Ootd />;
            case "posts":
                return <Discover />;

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
                        <TouchableOpacity style={styles.iconButton}>
                            <Feather name="user-plus" size={24} color="white" />
                        </TouchableOpacity>
                        <TabBar
                            {...props}
                            indicatorStyle={styles.indicatorStyle}
                            style={styles.tabBar}
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
                        <TouchableOpacity style={styles.iconButton}>
                            <Feather name="bell" size={24} color="white" />
                        </TouchableOpacity>
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
        backgroundColor: "black",
    },
    tabBarContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "transparent",
        top: 60,
        zIndex: 1,
        marginHorizontal: 10,
    },
    tabBar: {
        flex: 1,
        backgroundColor: "transparent",
        wdith: "60%",
        zIndex: 2,
    },
    indicatorStyle: {
        backgroundColor: "white",
        width: 50,
        bottom: 12,
        justifyContent: "center",
        marginHorizontal: 35,
        borderRadius: 5,
    },
    tabLabelContainer: {
        flex: 1,
        backgroundColor: "transparent",
        marginTop: 5,
    },
    focusedText: {
        color: "white",
        fontFamily: "JosefinSans_400Regular",
        fontSize: 19,
    },
    unfocusedText: {
        color: "#888", // Grey color for unfocused tabs
        fontFamily: "JosefinSans_400Regular",
        fontSize: 19,
    },
    iconButton: {
        paddingHorizontal: 20,
    },
});
