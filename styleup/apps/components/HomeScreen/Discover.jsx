import {
    View,
    StyleSheet,
    Image,
    ActivityIndicator,
    Dimensions,
} from "react-native";
import Swiper from "react-native-deck-swiper";
import React from "react";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Discover({ latestCards }) {
    if (!latestCards || latestCards.length === 0) {
        return (
            <View style={styles.outerContainer}>
                <ActivityIndicator color="#ffff" size="large" />
            </View>
        );
    }

    return (
        <View style={styles.outerContainer}>
            <Swiper
                cards={latestCards}
                renderCard={(card) => {
                    return (
                        <View style={styles.card}>
                            <Image
                                source={{ uri: card.image }}
                                style={styles.image}
                            />
                        </View>
                    );
                }}
                onSwiped={(cardIndex) => console.log(cardIndex)}
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
    outerContainer: {
        flex: 1,
    },
    card: {
        width: screenWidth,
        height: screenHeight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});

