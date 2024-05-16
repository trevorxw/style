import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

export default function Followers({user}) {

    return (
        <View style={styles.container}>
            <TouchableOpacity>
                <Text style={styles.number}>{user.followers.length}</Text>
                <Text style={styles.text}>Followers</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 30,
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
