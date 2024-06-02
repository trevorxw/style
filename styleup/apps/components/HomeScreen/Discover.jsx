import {
    View,
    StyleSheet,
    Image,
    ActivityIndicator,
    Dimensions,
    TouchableOpacity,
    Text,
    Animated,
} from "react-native";
import Swiper from "react-native-deck-swiper";
import React, { useState, useRef, useEffect } from "react";
import Post from "./Post";
import { AntDesign } from "@expo/vector-icons";
//Firebase
import { getFirestore, doc, updateDoc, increment } from "firebase/firestore";
import { app } from "../../../firebaseConfig";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Discover() {
    const db = getFirestore(app);

    const [cardIndex, setCardIndex] = useState(0);
    const [swipeTimes, setSwipeTimes] = useState({});
    const [cards, setCards] = useState([])
    const swipeTimer = useRef(null);

    useEffect(() => {
        // Start the timer when the card is rendered
        swipeTimer.current = Date.now();
    }, [cardIndex]);

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

    const incrementLike = async (card) => {
        const likesRef = doc(db, "all_posts", card.id);
        await updateDoc(likesRef, {
            likes: increment(1),
        });
    };

    const onSwiped = (index, direction, card) => {
        const duration = Date.now() - swipeTimer.current;
        console.log(
            `Card ${index} swiped ${direction} after ${duration} milliseconds.`
        );
        setSwipeTimes((prevTimes) => ({
            ...prevTimes,
            [index]: {
                direction,
                duration,
            },
        }));
        setCardIndex(index + 1); // Update card index to the next card
        swipeTimer.current = Date.now(); // Reset the timer for the new card
        if (direction === "right") {
            incrementLike(card);
        }
    };

    const overlayLabels = {
        left: {
            element: (
                <View style={styles.overlayLabelLeft}>
                    <AntDesign name="close" size={28} color="red" />
                    <Text style={styles.overlayLabelText}>NOPE</Text>
                </View>
            ),
            style: {
                wrapper: styles.leftOverlay,
            },
        },
        right: {
            element: (
                <View style={styles.overlayLabelRight}>
                    <AntDesign name="heart" size={28} color="green" />
                    <Text style={styles.overlayLabelText}>LIKE</Text>
                </View>
            ),
            style: {
                wrapper: styles.rightOverlay,
            },
        },
    };

    if (!cards || cards.length === 0) {
        return (
            <View style={styles.swiperContainer}>
                <ActivityIndicator size="large" color="#888" />
            </View>
        );
    }

    return (
        <View style={styles.swiperContainer}>
            <Swiper
                cards={cards}
                renderCard={(card) => {
                    return (
                        <View style={styles.postContainer}>
                            <Post card={card} />
                        </View>
                    );
                }}
                onSwipedLeft={(index) =>
                    onSwiped(index, "left", latestCards[index])
                }
                onSwipedRight={(index) =>
                    onSwiped(index, "right", latestCards[index])
                }
                onSwipedAll={() => console.log("onSwipedAll")}
                cardIndex={0}
                backgroundColor={"black"}
                stackSize={3}
                stackScale={0}
                stackSeparation={0}
                verticalSwipe={false}
                outputRotationRange={["-5deg", "0deg", "5deg"]}
                cardVerticalMargin={0}
                cardHorizontalMargin={0}
                overlayLabels={overlayLabels}
                animateCardOpacity={true}
                infinite={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    swiperContainer: {
        flex: 1,
    },
    postContainer: {
        flex: 1,
        width: screenWidth,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
    },
    overlayLabelLeft: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.5)", // Semi-transparent background
    },
    overlayLabelRight: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "green",
        backgroundColor: "rgba(0, 128, 0, 0.5)", // Semi-transparent background
    },
    overlayLabelText: {
        fontSize: 24,
        color: "white",
        fontWeight: "bold",
        marginLeft: 5,
    },
    leftOverlay: {
        position: "absolute",
        top: 50,
        right: 20,
    },
    rightOverlay: {
        position: "absolute",
        top: 50,
        left: 20,
    },
});
