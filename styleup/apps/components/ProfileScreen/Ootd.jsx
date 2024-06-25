import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FlatGrid } from "react-native-super-grid";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Ootd({ user }) {
    const [loading, setLoading] = useState(true);
    const [userOotd, setUserOotd] = useState([]);
    const numColumns = 3;
    const spacing = 1; // Space between items
    const itemWidth = (screenWidth - (numColumns - 1) * spacing) / numColumns;
    const navigation = useNavigation();

    useEffect(() => {
        if (user) {
            getUserOotd();
        }
    }, [user]);

    const parseCustomDateString = (dateStr) => {
        // Example input: "June 25, 2024 at 6:40:09 AM UTC-7"
        const cleanedDateStr = dateStr.replace(" at ", " "); // Remove 'at'
        // Simplify UTC-7 to offset format if necessary here
        return new Date(cleanedDateStr);
    };

    const checkIfMostRecentPostIsToday = (posts) => {
        if (posts.length === 0) return true; // No posts, so assume it's not from today

        const mostRecentPost = posts[0]; // Assuming posts are sorted with the most recent first
        const mostRecentPostDate = parseCustomDateString(
            mostRecentPost.created_at
        );
        const today = new Date();

        return mostRecentPostDate.toDateString() === today.toDateString();
    };

    const getUserOotd = async () => {
        const posts = [];
        setLoading(true);

        // Fetch details for each post using the post ID
        try {
            const response = await fetch(
                `https://3cc7-2600-1700-3680-2110-c494-b15d-2488-7b57.ngrok-free.app/ootd/${user.id}`
            );
            const ootdData = await response.json();
            for (const post of ootdData) {
                try {
                    const response = await fetch(
                        `https://3cc7-2600-1700-3680-2110-c494-b15d-2488-7b57.ngrok-free.app/cards/${post.post_id}`
                    );
                    const postData = await response.json();
                    if (postData) {
                        posts.push(postData);
                    }
                } catch (error) {
                    console.error("Error fetching ootd data", error);
                }
            }
            if (ootdData.length !== 0) {
                console.log("Add addButton to existing ootds");
                let oodtsWithAddButton = [...posts];
                // Check if the most recent post is not from today
                if (!checkIfMostRecentPostIsToday(posts)) {
                    oodtsWithAddButton = [{ isAddButton: true }, ...posts];
                }
                setUserOotd(oodtsWithAddButton);
            } else {
                console.log("user has no previous ootds");
                setUserOotd([{ isAddButton: true }]);
            }
        } catch (error) {
            console.error("Error fetching ootd data", error);
        }
    };

    const onLoadEnd = () => {
        setLoading(false);
    };

    return (
        <FlatGrid
            data={userOotd}
            style={styles.gridView}
            spacing={0}
            renderItem={({ item, index }) => {
                if (item.isAddButton) {
                    return (
                        <TouchableOpacity
                            style={styles.addItemContainer}
                            onPress={() => {
                                navigation.navigate("ootdCamera", {});
                            }}
                        >
                            <Feather
                                name="plus-circle"
                                size={40}
                                color="#C4C4C4"
                            />
                        </TouchableOpacity>
                    );
                }
                return (
                    <View
                        style={[
                            styles.itemContainer,
                            {
                                marginRight:
                                    (index + 1) % numColumns === 0 ? 0 : 1, // Right margin for items not in the last column
                                marginBottom: 1, // Bottom margin for all items
                            },
                        ]}
                    >
                        <TouchableOpacity>
                            <Image
                                source={item.url}
                                onLoadEnd={onLoadEnd}
                                style={styles.image}
                            />
                        </TouchableOpacity>
                        {loading && (
                            <ActivityIndicator
                                style={styles.activityIndicator}
                                size="small"
                                color="#0000ff"
                            />
                        )}
                    </View>
                );
            }}
        />
    );
}

const styles = StyleSheet.create({
    gridView: {
        flex: 1,
    },
    itemContainer: {
        flex: 1,
        justifyContent: "flex-end",
        height: 150,
    },
    image: {
        width: (screenWidth * 1) / 3,
        height: 150,
        contentFit: "cover",
    },
    activityIndicator: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    addItemContainer: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(196, 196, 196, 0.2)",
        height: 150,
        marginBottom: 1,
        marginRight: 1,
    },
});
