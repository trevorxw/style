import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { getFirestore, doc, updateDoc, increment } from "firebase/firestore";
import { app } from "../../../firebaseConfig";

export default function Like({ card }) {
    console.log(card);
    const db = getFirestore(app);
    // Assuming card.id is the document ID. Adjust according to your data structure.
    const likesRef = doc(db, "UserPost", card.id);

    // State to track if the icon is liked
    const [isLiked, setIsLiked] = useState(false);

    const incrementLike = async () => {
        await updateDoc(likesRef, {
            likes: increment(1),
        });
        // Consider calling changeColor() here after successfully updating to ensure state consistency
        changeColor();
    };

    // Function to handle press action
    const changeColor = () => {
        setIsLiked(!isLiked); // Toggle the liked state
    };

    return (
        <View>
            <TouchableOpacity
                onPress={() => {
                    incrementLike(); // Correctly call the functions when pressed
                }}
                style={styles.buttons}
            >
                <FontAwesome
                    name={isLiked ? "heart" : "heart-o"}
                    size={35}
                    color={isLiked ? "red" : "white"}
                />
            </TouchableOpacity>
            {/* Assuming card.likes is a number. Adjust if it's stored differently. */}
            <Text style={styles.buttonText}>{card.likes}</Text>
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
