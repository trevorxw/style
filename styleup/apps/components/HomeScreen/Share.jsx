import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";

export default function Share({ card }) {
    return (
        <View>
            <TouchableOpacity style={styles.buttons}>
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
