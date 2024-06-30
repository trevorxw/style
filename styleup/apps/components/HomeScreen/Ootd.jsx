import {
    View,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
    Text,
} from "react-native";
import Swiper from "react-native-deck-swiper";
import React, { useState, useRef, useEffect, useContext } from "react";
import Post from "./Post";
import { AntDesign } from "@expo/vector-icons";
//Firebase
import { getFirestore, doc, updateDoc, increment } from "firebase/firestore";
import { app } from "../../../firebaseConfig";
//Request
import { fetchWithTimeout } from "../../../utils/fetchWithTimeout";
import { getFirebaseToken } from "../../../utils";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Ootd({user}) {
    const db = getFirestore(app);

    const [cardIndex, setCardIndex] = useState(0);
    const [swipeTimes, setSwipeTimes] = useState({});
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const swipeTimer = useRef(null);
    const swiperRef = useRef(null);

    const MAX_CARDS = 20; // Max number of cards to hold in memory

    // Start the timer when the card is rendered
    useEffect(() => {
        swipeTimer.current = Date.now();
    }, [cardIndex]);

    // Fetch initial cards
    useEffect(() => {
        getOotds();
    }, []);

    // const swipeRight = useCallback((index) => {
    //     if (swiperRef.current) {
    //         swiperRef.current.swipeRight();
    //     }
    // }, [swiperRef.current, cards]);

    const getOotds = async () => {
        try {
            const token = await getFirebaseToken();
            const response = await fetch(
                `https://1c3f-2600-1700-3680-2110-c5e1-68dc-a20a-4910.ngrok-free.app/ootds/${user.id}`,{
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const fetchedCards = await response.json();
            console.log(`Displaying ootds: ${fetchedCards[0]}, ${response}`);
            setCards(fetchedCards);
        } catch (error) {
            console.error("Error fetching cards:", error);
        }
    };

    const uploadMetrics = async (user, card, liked, duration, shared) => {
        try {
            // Create a data object for JSON body
            const postData = {
                liked: liked,
                duration: duration,
                shared: shared,
                time: Date.now(),
            };
            // Post request to Flask endpoint
            console.log(`Uploading user metrics for ${card.post_id}`);
            const token = await getFirebaseToken();
            const response = await fetchWithTimeout(
                `https://1c3f-2600-1700-3680-2110-c5e1-68dc-a20a-4910.ngrok-free.app/like/${user.id}/${card.user_id}/${card.post_id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(postData),
                }
            );

            const result = await response.json();
            if (response.ok) {
                console.log(
                    `Uploaded metrics successfully for user: ${user.id}. Card: ${card.post_id}, Metrics:`,
                    postData
                );
            } else {
                console.error(
                    "Failed to upload metrics. Server responded with: ",
                    result
                );
            }
        } catch (error) {
            console.error("Error uploading user post metrics:", error);
        }
    };


    const onSwiped = (index, direction, card) => {
        // Metric Tracker
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

        // Lazy Loading
        // if (index === cards.length - 5) {
        //     fetchAndReplaceCards();  // Fetch more cards when 5 cards are left
        // }

        if (direction === "right") {
            uploadMetrics(user, card, 1, duration, 0);
        } else {
            uploadMetrics(user, card, 0, duration, 0);
        }
    };

    const overlayLabels = {
        left: {
            element: (
                <View style={styles.overlayLabelLeft}>
                    <AntDesign name="close" size={28} color="white" />
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
                    <AntDesign name="heart" size={28} color="white" />
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
            <View style={styles.header}></View>
            <Swiper
                cards={cards}
                ref={swiperRef}
                renderCard={(card, index) => {
                    return (
                        <View style={styles.postContainer}>
                            <Post card={card} />
                        </View>
                    );
                }}
                onSwipedLeft={(index) => onSwiped(index, "left", cards[index])}
                onSwipedRight={(index) =>
                    onSwiped(index, "right", cards[index])
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
                animateCardOpacity={false}
                horizontalThreshold={60}
                overlayOpacityHorizontalThreshold={60}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    swiperContainer: {
        flex: 1,
        top: -51,
    },
    postContainer: {
        flex: 1,
    },
    // height controls top container
    header: {
        position: "absolute",
        backgroundColor: "black",
        top: 0,
        width: screenWidth,
        height: 65,
        zIndex: 1,
    },
    overlayLabelLeft: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        marginTop: 30,
    },
    overlayLabelRight: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        marginTop: 30,
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
    },
    rightOverlay: {
        position: "absolute",
        top: 50,
    },
});
