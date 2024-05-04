import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

export default function Following() {
    return (
        <View style={styles.container}>
            <TouchableOpacity>
                <Text style={styles.number}>20</Text>
                <Text style={styles.text}>Following</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 0,
        // backgroundColor: "#FFFF",
    },
    number: {
        fontSize: 20,
        textAlign: "center",
        fontWeight: 'bold',
    },
    text: {
        fontSize: 15,
        textAlign: "center",
    },
});
