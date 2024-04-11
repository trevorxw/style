import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function Like({ card }) {
    // State to track if the icon is liked
    const [isLiked, setIsLiked] = useState(false);

    // Function to handle press action
    const changeColor = () => {
        setIsLiked(!isLiked); // Toggle the liked state
    };
    
    return (
        <View>
            <TouchableOpacity onPress={changeColor} style={styles.buttons}>
                <FontAwesome
                    name={isLiked ? "heart" : "heart-o"}
                    size={35}
                    color={isLiked ? "red" : "white"}
                />
            </TouchableOpacity>
            <Text style={[styles.buttonText]}>{card.likes}0</Text>
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
        color: 'white',
    },
});
