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
import Post from "./Post";

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
                        <Post card={card}/>
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
});
