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

export default function Posts() {
    const db = getFirestore(app);
    const { user } = useUser();
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        user && getUserPost();
    }, []);

    // Query firebase database for UserPost data
    const getUserPost = async () => {
        setUserPosts([]);
        const q = query(
            collection(db, "UserPost"),
            where("userId", "==", user.id)
        );
        const snapshot = await getDocs(q);
        snapshot.forEach((doc) => {
            setUserPosts((userPosts) => [...userPosts, doc.data()]);
        });
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
                        source={{ uri: item.image }}
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
        width: screenWidth/3,
        height: 150,
        justifyContent: "flex-end",
        borderRadius: 5,
        borderBlockColor: "#FFFFF",
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    activityIndicator: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
});
