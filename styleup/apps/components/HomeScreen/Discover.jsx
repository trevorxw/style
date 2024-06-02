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
import { AntDesign } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Discover({ latestCards }) {
    const [cardIndex, setCardIndex] = useState(0);
    const swipeTimer = useRef(null);

    useEffect(() => {
        // Start the timer when the card is rendered
        swipeTimer.current = Date.now();
    }, [cardIndex]);

    const onSwiped = (index, direction) => {
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

    if (!latestCards || latestCards.length === 0) {
        return (
            <View style={styles.swiperContainer}>
                <ActivityIndicator size="large" color="#888" />
            </View>
        );
    }

    return (
        <View style={styles.swiperContainer}>
            <Swiper
                cards={latestCards}
                renderCard={(card) => {
                    return (
                        <View style={styles.postContainer}>
                            <Post card={card} />
                        </View>
                    );
                }}
                onSwipedLeft={(index) => onSwiped(index, "left")}
                onSwipedRight={(index) => onSwiped(index, "right")}
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: 'red',
        backgroundColor: 'rgba(255, 0, 0, 0.5)', // Semi-transparent background
    },
    overlayLabelRight: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: 'green',
        backgroundColor: 'rgba(0, 128, 0, 0.5)', // Semi-transparent background
    },
    overlayLabelText: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    leftOverlay: {
        position: 'absolute',
        top: 50,
        right: 20,
    },
    rightOverlay: {
        position: 'absolute',
        top: 50,
        left: 20,
    },
});
