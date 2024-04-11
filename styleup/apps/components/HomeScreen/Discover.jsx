import {
    View,
    StyleSheet,
    Image,
    ActivityIndicator,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import Swiper from "react-native-deck-swiper";
import React from "react";
import { Feather } from "@expo/vector-icons";

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
        <View style={styles.swiperContainer}>
            <Swiper
                cards={latestCards}
                renderCard={(card) => {
                    return (
                        <View style={styles.card}>
                            <View style={styles.buttons}>
                                <TouchableOpacity>
                                    <Feather
                                        name="heart"
                                        size={28}
                                        color="white"
                                    />
                                </TouchableOpacity>
                            </View>
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
    swiperContainer: {
        flex: 1,
    },
    card: {
        flex: 1,
        width: screenWidth,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    buttons: {
        position: "absolute",
        zIndex: 10,
        right: 20,
        borderWidth: 2,
        borderColor: "red",
        justifyContent: "right",
    },
});
