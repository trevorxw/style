import {
    View,
    Text,
    StyleSheet,
    Image,
    ActivityIndicator,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FlatGrid } from "react-native-super-grid";
import { formatNumber } from "../../../utils/formatNumber";
import { FontAwesome6 } from '@expo/vector-icons';


const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Posts({ user }) {
    const [loading, setLoading] = useState(true);
    const [userPosts, setUserPosts] = useState([]);
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
        for (const post of user.post_ids) {
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
                            marginRight:
                                (index + 1) % numColumns === 0 ? 0 : 1, // Right margin for items not in the last column
                            marginBottom: 1, // Bottom margin for all items
                        },
                    ]}
                >
                    <TouchableOpacity>

                        <Image
                            source={{ uri: item.url }}
                            onLoadEnd={onLoadEnd}
                            style={styles.image}
                        />
                        <View style = {styles.corner}>
                        <FontAwesome6 name="heart" size={16} color="white" />
                        <Text style={styles.text}>{formatNumber(item.likes)}</Text>
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
    text: {
        color: "#D9D9D9",
        fontFamily: "JosefinSans_400Regular",
        fontSize: 16,
        color: 'white',
        opacity: 1,
        position: 'absolute',
        left: 19,
        bottom: -1,
        //backgroundColor: 'rgba(0, 0, 0, 0.5)',
        // padding: 5,
        // borderRadius: 3,
    },
    corner: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 5,
        left: 5,
        alignItems: 'center'

    },

});
