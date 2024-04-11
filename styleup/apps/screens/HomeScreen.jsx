import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Discover from "../components/HomeScreen/Discover";
import { app } from "../../firebaseConfig";
import { getFirestore, getDocs, collection } from "firebase/firestore";

export default function HomeScreen() {
    const db = getFirestore(app);

    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCards();
    }, []);

    const getCards = async () => {
        try {
            console.log("Fetching Cards");
            const querySnapshot = await getDocs(collection(db, "UserPost"));
            const fetchedCards = querySnapshot.docs.map(doc => ({
                id: doc.id, // Include the document ID
                ...doc.data() // Spread the rest of the document data
            }));
            setCards(fetchedCards);
        } catch (error) {
            console.error("Error fetching cards:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator color="#fff" />
            </View>
        );
    }

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
