import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "expo-image";
import { FlatGrid } from "react-native-super-grid";
import { useNavigation } from "@react-navigation/native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Swipes({ user }) {
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const [userSwipedPosts, setSwipedPosts] = useState([]);
    const numColumns = 3;

    useEffect(() => {
        if (user) {
            getUserLikes();
        }
    }, [user]);

    const getUserLikes = async () => {
        const posts = [];
        setLoading(true);

        // Fetch details for each post using the post ID
        try {
            const response = await fetch(
                `https://1c3f-2600-1700-3680-2110-c5e1-68dc-a20a-4910.ngrok-free.app/likes/${user.id}`
            );
            const likesData = await response.json();
            console.log(
                `Getting likes for user: ${user.id}.\nposts: ${likesData.posts}`
            );
            for (const post of likesData) {
                try {
                    const response = await fetch(
                        `https://1c3f-2600-1700-3680-2110-c5e1-68dc-a20a-4910.ngrok-free.app/cards/${post.post_id}`
                    );
                    const postData = await response.json();
                    const enrichedPostData = { ...postData, ...post };
                    if (postData) {
                        posts.push(enrichedPostData);
                    }
                } catch (error) {
                    console.error("Error fetching liked post data", error);
                }
            }
        } catch (error) {
            console.error("Error fetching liked post data", error);
        }

        setSwipedPosts(posts);
    };

    const onLoadEnd = () => {
        setLoading(false);
    };

    return (
        <FlatGrid
            itemDimension={130}
            data={userSwipedPosts}
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
                        {item.url != "" ? (
                            <Image
                                source={item.url}
                                onLoadEnd={onLoadEnd}
                                style={styles.image}
                            />
                        ) : (
                            <ActivityIndicator
                                style={styles.activityIndicator}
                                size="small"
                                color="#0000ff"
                            />
                        )}
                    </TouchableOpacity>
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
