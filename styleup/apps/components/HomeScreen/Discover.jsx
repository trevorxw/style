import {
    View,
    StyleSheet,
    Image,
    ActivityIndicator,
    Dimensions,
    TouchableOpacity,
    Text,
} from "react-native";
import Swiper from "react-native-deck-swiper";
import React, { useState, useRef, useEffect } from "react";
import Post from "./Post";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Discover({ latestCards }) {
    const [cardIndex, setCardIndex] = useState(0);
    const [swipeTimes, setSwipeTimes] = useState({});
    const swipeTimer = useRef(null);

    useEffect(() => {
        // Start the timer when the card is rendered
        swipeTimer.current = Date.now();
    }, [cardIndex]);

    const onSwiped = (index, direction) => {
        const duration = Date.now() - swipeTimer.current;
        console.log(`Card ${index} swiped ${direction} after ${duration} milliseconds.`);
        setSwipeTimes(prevTimes => ({
            ...prevTimes,
            [index]: {
                direction,
                duration
            }
        }));
        setCardIndex(index + 1); // Update card index to the next card
        swipeTimer.current = Date.now(); // Reset the timer for the new card
    };

    if (!latestCards || latestCards.length === 0) {
        return (
            <View style={styles.swiperContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.swiperContainer}>
            <Swiper
                cards={latestCards}
                renderCard={(card) => {
                    return (
                        <Post card={card}/>
                    );
                }}   
                onSwipedLeft={(index) => onSwiped(index, "left")}
                onSwipedRight={(index) => onSwiped(index, "right")}
                onSwipedAll={() => console.log("onSwipedAll")}
                cardIndex={0}
                backgroundColor={"#4FD0E9"}
                stackSize={3}
                stackScale={0}
                stackSeparation={0}
                verticalSwipe={false}
                outputRotationRange={["0deg", "0deg", "0deg"]}
                cardVerticalMargin={0}
                cardHorizontalMargin={0}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    swiperContainer: {
        flex: 1,
    },
});
