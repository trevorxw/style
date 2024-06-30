import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import {
    useFonts,
    JosefinSans_700Bold,
    JosefinSans_100Thin,
} from "@expo-google-fonts/josefin-sans";

export default function Following({user}) {
    let [fontsLoaded] = useFonts({
        JosefinSans_700Bold,
        JosefinSans_100Thin,
    });
    return (
        <View style={styles.container}>
            <TouchableOpacity>
                <Text style={styles.number}>{Object.keys(user.following).length}</Text>
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
        fontSize: 25,
        textAlign: "center",
        fontWeight: "bold",
        fontFamily: "JosefinSans_700Bold",
    },
    text: {
        fontSize: 17,
        textAlign: "center",
        fontFamily: "JosefinSans_100Thin",
    },
});
