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
import { useUser } from "@clerk/clerk-expo";
import moment from "moment";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Ootd({ user }) {
    const [loading, setLoading] = useState(true);
    const [userOotd, setUserOotd] = useState([]);
    const numColumns = 3;
    const spacing = 1; // Space between items
    const itemWidth = (screenWidth - (numColumns - 1) * spacing) / numColumns;
    const { isLoading, isSignedIn, user: userClerk } = useUser();
    const navigation = useNavigation();

    useEffect(() => {
        if (user && user.id == userClerk.id) {
            getUserOotd();
        } else {
            getOtherUserOotd();
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

    const formatDate = (date) => {
        date = parseCustomDateString(date);
        const day = date.getDate();
        const month = date.getMonth() + 1; // getMonth() is zero-indexed
        const year = date.getFullYear();

        // Pad the day and month with zeros if they are less than 10
        // const formattedDay = day < 10 ? `0${day}` : day;
        // const formattedMonth = month < 10 ? `0${month}` : month;
        const formattedYear = year.toString().slice(-2);

        return `${month}/${day}/${formattedYear}`;
    };

    const getOtherUserOotd = async () => {
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
                    const enrichedPostData = { ...postData, ...post };
                    if (postData) {
                        posts.push(enrichedPostData);
                    }
                } catch (error) {
                    console.error("Error fetching ootd data", error);
                }
            }
            setUserOotd(posts);
        } catch (error) {
            console.error("Error fetching ootd data", error);
        }
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
                    const enrichedPostData = { ...postData, ...post };
                    if (postData) {
                        posts.push(enrichedPostData);
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
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("post", {
                                    post: item,
                                })
                            }
                        >
                            <Image
                                source={item.url}
                                onLoadEnd={onLoadEnd}
                                style={styles.image}
                            />
                            <View style={styles.infoContainer}>
                                <Feather
                                    name="calendar"
                                    size={12}
                                    color="white"
                                />
                                <Text style={styles.infoText}>
                                    {formatDate(item.created_at)}
                                </Text>
                            </View>
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
    infoContainer: {
        flexDirection: "row",
        position: "absolute",
        bottom: 5,
        left: 5,
    },
    infoText: {
        fontFamily: "JosefinSans_400Regular",
        fontSize: 12,
        color: "white",
        marginLeft: 3,
        bottom: -3,
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
