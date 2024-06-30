import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { getFirestore, doc, updateDoc, increment } from "firebase/firestore";
import { app } from "../../../firebaseConfig";

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + "M";
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + "K";
    } else {
        return num.toString();
    }
}

export default function Like({ card, swipeRight }) {
    const db = getFirestore(app);
    const likesRef = doc(db, "all_posts", card.post_id);

    // State to track if the icon is liked
    const [isLiked, setIsLiked] = useState(false);

    const incrementLike = async () => {
        await updateDoc(likesRef, {
            likes: increment(1),
        });
    };
    const decrementLike = async () => {
        await updateDoc(likesRef, {
            likes: increment(-1),
        });
    };

    return (
        <View>
            <TouchableOpacity
                disabled={true}
                onPress={() => {
                    swipeRight();
                    incrementLike();
                }}
                style={styles.buttons}
            >
                <FontAwesome
                    name={isLiked ? "heart" : "heart-o"}
                    size={30}
                    color={isLiked ? "red" : "white"}
                />
            </TouchableOpacity>
            <Text style={styles.buttonText}>
                {isLiked
                    ? formatNumber(card.likes + 1)
                    : formatNumber(card.likes)}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    buttons: {
        alignSelf: "center",
    },
    buttonText: {
        marginTop: 2,
        marginBottom: 12,
        fontSize: 15,
        alignSelf: "center",
        fontWeight: "bold",
        color: "white",
    },
});
