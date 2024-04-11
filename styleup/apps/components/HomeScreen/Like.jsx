import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import React from "react";

export default function Like({ card }) {
    return (
        <View>
            <TouchableOpacity style={styles.buttons}>
                <Feather name="heart" size={35} color="white" />
            </TouchableOpacity>
            <Text style={styles.buttonText}>{card.likes}0</Text>
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
