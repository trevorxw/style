import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
} from "react-native";
import useFetchUser from "../../../hooks/useFetchUser";
import Like from "./Like";
import Share from "./Share";
import ProfilePicture from "./ProfilePicture";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Post({ card }) {
    const { user, loading, error } = useFetchUser(card.user_id);

    if (loading) {
        return <ActivityIndicator size="large" color="#888" />;
    }

    if (error) {
        return <Text>Error loading user data!</Text>;
    }

    if (!user) {
        return <Text>No user data available.</Text>;
    }

    return (
        <View style={styles.card}>
            <View style={styles.buttonsContainer}>
                <ProfilePicture user={user} />
                <Like card={card} />
                {/* <Share card={card} /> */}
            </View>
            <Image source={{ uri: card.url }} style={styles.image} />
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
    buttonsContainer: {
        position: "absolute",
        zIndex: 10,
        right: (screenWidth * 1) / 30,
        top: (screenHeight * 5) / 8,
        justifyContent: "center",
    },
});
