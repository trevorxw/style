import {
    View,
    Text,
    StyleSheet,
    Image,
    ActivityIndicator,
    Dimensions,
    TouchableOpacity
} from "react-native";
import React, { useEffect, useState } from "react";
import { FlatGrid } from "react-native-super-grid";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Swipes({ user }) {
    const [loading, setLoading] = useState(true);
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
                `https://3cc7-2600-1700-3680-2110-c494-b15d-2488-7b57.ngrok-free.app/likes/${user.id}`
            );
            const likesData = await response.json();
            for (const post of likesData) {
                try {
                    const response = await fetch(
                        `https://3cc7-2600-1700-3680-2110-c494-b15d-2488-7b57.ngrok-free.app/cards/${post.post_id}`
                    );
                    const postData = await response.json();
                    if (postData) {
                        posts.push(postData);
                    }
                } catch (error) {
                    console.error("Error fetching post data", error);
                }
            }
        } catch (error) {
            console.error("Error fetching post data", error);
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
                    <TouchableOpacity>
                        {item.url != "" ? (
                            <Image
                                source={{ uri: item.url }}
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
        resizeMode: "cover",
    },
    activityIndicator: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
});
