import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Discover from "../../components/HomeScreen/Discover";
import { app } from "../../../firebaseConfig";
import { getFirestore, getDocs, collection } from "firebase/firestore";

export default function HomeScreen() {

    return (
        <View style={styles.container}>
            <Discover/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
