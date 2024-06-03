import {
    View,
    Text,
    StyleSheet,
    Image,
    ActivityIndicator,
    Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    getFirestore,
    query,
    where,
} from "firebase/firestore";
import { app } from "../../../firebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import { FlatGrid } from "react-native-super-grid";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Swipes({ user }) {
    const [loading, setLoading] = useState(true);
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        if (user) {
            getUserPosts();
        }
    }, [user]);


    const getUserPosts = async () => {
        const posts = [];
        setLoading(true);

        // Fetch details for each post using the post ID
        for (const post of user.post_ids) {
            try {
                const response = await fetch(
                    `https://5025-2600-1700-3680-2110-7567-7952-aacc-8b36.ngrok-free.app/cards/${post.post_id}`
                );
                const postData = await response.json();
                if (postData) {
                    posts.push(postData);
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
            itemDimension={130}
            data={userPosts}
            style={styles.gridView}
            spacing={0}
            renderItem={({ item }) => (
                <View
                    style={[
                        styles.itemContainer,
                        { backgroundColor: item.code },
                    ]}
                >
                    <Image
                        source={{ uri: item.url }}
                        onLoadEnd={onLoadEnd}
                        style={styles.image}
                    />
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
        borderRadius: 5,
        width: screenWidth / 3,
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
