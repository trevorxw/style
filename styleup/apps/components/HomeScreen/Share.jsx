import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useState } from "react";
import { getFirestore, doc, updateDoc, increment } from "firebase/firestore";
import { app } from "../../../firebaseConfig";

export default function Share({ card }) {
    const db = getFirestore(app);
    // Assuming card.id is the document ID. Adjust according to your data structure.
    const shareRef = doc(db, "UserPost", card.id);

    // State to track if the icon is liked
    const [isShared, setIsShared] = useState(false);

    const incrementShare = async () => {
        await updateDoc(shareRef, {
            shares: increment(1),
        });
    };

    return (
        <View>
            <TouchableOpacity
                onPress={() => {
                    if (!isShared) {
                        incrementShare();
                        setIsShared(true);
                    }
                }}
                style={styles.buttons}
            >
                <FontAwesome5 name="share" size={35} color="white" />
            </TouchableOpacity>
            <Text style={styles.buttonText}>{card.shares}</Text>
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
        color: "white",
        fontWeight: "bold",
    },
});
