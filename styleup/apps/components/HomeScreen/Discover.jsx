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
import React, { useState } from "react";
import Like from "./Like";
import Share from "./Share";
import ProfilePicture from "./ProfilePicture";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Discover({ latestCards }) {
    const [pressed, setPressed] = useState(false);

    if (!latestCards || latestCards.length === 0) {
        return (
            <View style={styles.swiperContainer}>
                <Swiper
                    cards={['Loading', 'Loading', 'Loading', 'Loading']}
                    renderCard={(card) => {
                        return (
                            <View style={styles.card}>
                                {/* <Image
                                    source={ require("../../../assets/images/placeholder.jpg") }
                                    style={styles.placeholderimage}
                                /> */}
                                <ActivityIndicator size="large" color="#0000ff" />
                            </View>
                        );
                    }}
                    onSwiped={(cardIndex) => console.log(cardIndex)}
                    onSwipedAll={() => console.log("onSwipedAll")}
                    cardIndex={0}
                    backgroundColor={"#808080"}
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

    return (
        <View style={styles.swiperContainer}>
            <Swiper
                cards={latestCards}
                renderCard={(card) => {
                    return (
                        <View style={styles.card}>
                            <View style={styles.buttonsContainer}>
                                <ProfilePicture card={card} />
                                <Like card={card} />
                                <Share card={card} />
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
    placeholderimage: {
        width: "80%",
        height: "80%",
        resizeMode: "cover",
    },
    buttonsContainer: {
        position: "absolute",
        zIndex: 10,
        right: (screenWidth * 1) / 30,
        top: (screenHeight * 5) / 8,
        justifyContent: "center",
    },
    profileImage: {
        marginBottom: 20,
        width: 44, // Tailwind w-[120px]
        height: 44, // Tailwind h-[120px]
        borderRadius: 60, // Tailwind rounded-full
        borderWidth: 2,
        borderColor: "white",
    },
    buttons: {
        alignSelf: "center",
    },
    buttonText: {
        marginTop: 2,
        marginBottom: 12,
        fontSize: 15,
        alignSelf: "center",
        color: "white",
        fontWeight: "bold",
    },
});
