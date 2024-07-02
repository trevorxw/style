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
import { useNavigation } from "@react-navigation/native";
import { getFirebaseToken } from "../../../utils";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Posts({ user }) {
    const [loading, setLoading] = useState(true);
    const [userPosts, setUserPosts] = useState([]);
    const navigation = useNavigation();
    const numColumns = 3;
    const spacing = 1; // Space between items
    const itemWidth = (screenWidth - (numColumns - 1) * spacing) / numColumns;

    useEffect(() => {
        if (user) {
            getUserPosts();
        }
    }, [user]);

    const getUserPosts = async () => {
        const posts = [];
        setLoading(true);

        // Fetch details for each post using the post ID
        const token = await getFirebaseToken();
        for (const post of user.post_ids) {
            try {
                const response = await fetch(
                    `https://fitpic-flask-ys4dqjogsq-wl.a.run.app/cards/${post.post_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const postData = await response.json();
                const enrichedPostData = {
                    ...postData,
                    isLoading: true,
                    ...post,
                };
                if (postData) {
                    posts.push(enrichedPostData);
                }
            } catch (error) {
                console.error("Error fetching post data", error);
            }
        }
        setUserPosts(posts);
    };

    const onLoadEnd = () => {
        setLoading(false);
    };

    return (
        <FlatGrid
            data={userPosts}
            style={styles.gridView}
            spacing={0}
            renderItem={({ item, index }) => (
                <View
                    style={[
                        styles.itemContainer,
                        {
                            marginRight: (index + 1) % numColumns === 0 ? 0 : 1, // Right margin for items not in the last column
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
                            source={{
                                uri: item.url,
                                width: (screenWidth - 2) / 3,
                                height: 150,
                                scale: 1,
                            }}
                            onLoadEnd={onLoadEnd}
                            style={styles.image}
                            cachePolicy="memory-disk"
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
            )}
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
        width: "100%",
        height: "100%",
        contentFit: "cover",
    },
    activityIndicator: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
});
