import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Discover from "../components/HomeScreen/Discover";
import { app } from "../../firebaseConfig";
import { getFirestore, getDocs, collection } from "firebase/firestore";

export default function HomeScreen() {
    const db = getFirestore(app);

    const [cards, setCards] = useState([]);

    useEffect(() => {
        getCards();
    }, []);

    const getCards = async () => {
        try {
            const response = await fetch('https://5025-2600-1700-3680-2110-7567-7952-aacc-8b36.ngrok-free.app/cards/');
            const fetchedCards = await response.json();
            setCards(fetchedCards);
        } catch (error) {
            console.error("Error fetching cards:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Discover latestCards={cards} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
