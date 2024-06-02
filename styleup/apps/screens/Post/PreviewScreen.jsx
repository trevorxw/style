import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import React from "react";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function PreviewScreen({ route, navigation }) {
    const { image } = route.params;

    return (
        <View style={styles.card}>
            {image ? (
                <Image source={{ uri: image }} style={styles.image} />
            ) : (
                <Text>Add Image to Post</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        width: screenWidth,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'black',
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
    },
});
