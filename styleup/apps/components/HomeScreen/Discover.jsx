import {
    View,
    Text,
    StyleSheet,
    Button,
    Image,
    ActivityIndicator,
    Dimensions,
} from "react-native";
import Swiper from "react-native-deck-swiper";
import React from "react";
import Header from "./Header";
import Save from "./Save";

const screenHeight = Dimensions.get("window").height;

export default function Discover({ latestCards }) {
    if (!latestCards || latestCards.length === 0) {
        return (
            <View style={styles.container}>
                <ActivityIndicator color="#ffff" size="large" />
            </View>
        );
    }

    return (
        <View style={styles.outerContainer}>
            <Swiper
                cards={latestCards}
                renderCard={(card) => {
                    console.log(card);
                    return (
                        <View
                            style={[
                                styles.card,
                                { height: screenHeight * 1.5 },
                            ]}
                        >
                            <Image
                                source={{ uri: card.image }}
                                style={styles.image}
                            />
                            {/* <Text style={styles.text}>hi</Text> */}
                        </View>
                    );
                }}
                onSwiped={(cardIndex) => {
                    console.log(cardIndex);
                }}
                onSwipedAll={() => {
                    console.log("onSwipedAll");
                }}
                cardIndex={0}
                backgroundColor={"#4FD0E9"}
                stackSize={3}
                stackScale={0}
                stackSeparation={0}
                verticalSwipe={false}
                outputRotationRange={["0deg", "0deg", "0deg"]}
            >
                {/* <Header style={styles.header}/> */}
            </Swiper>
            {/* <Save style={styles.saveButton}/> */}
        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        justifyContent: "flex-start",
        backgroundColor: "#FFFF",
        height: 110,
    },
    card: {
        flex: 1,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: "#E8E8E8",
        justifyContent: "center",
        backgroundColor: "white",
        marginBottom:40,
    },
    image: {
        flex: 1,
        height: "100%",
        width: "100%",
        resizeMode: "cover",
    },
    saveButton: {
        position: "absolute",
        bottom: 40,
        right: 40,
    },
    header: {
        flex: 1,
        position: "absolute",
        bottom: 40,
        right: 40,
    },
});
