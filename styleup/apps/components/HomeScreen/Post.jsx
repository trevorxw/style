import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
    ScrollView,
    Alert,
} from "react-native";
import useFetchUser from "../../../hooks/useFetchUser";
import Like from "./Like";
import Share from "./Share";
import ProfilePicture from "./ProfilePicture";
import {
    useFonts,
    JosefinSans_400Regular,
    JosefinSans_700Bold,
} from "@expo-google-fonts/josefin-sans";
import * as WebBrowser from "expo-web-browser";
import { Image } from 'expo-image';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Post({ card, swipeRight}) {
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

    const openWebBrowser = async (url) => {
        try {
            await WebBrowser.dismissBrowser();
            const result = await WebBrowser.openBrowserAsync(`https://${url}`);
        } catch (error) {
            console.error("Failed to open URL: ", error);
            Alert.alert("Error", "Failed to open link");
        }
    }; 

    return (
        <View style={styles.card}>
            <View style={styles.buttonsContainer}>
                <ProfilePicture user={user} />
                <Like card={card} swipeRight={swipeRight}/>
                {/* <Share card={card} /> */}
            </View>
            <View style={styles.fieldsContainer}>
                <Text style={styles.usernameText}>@{user.username}</Text>
                <Text style={styles.descriptionText}>{card.description}</Text>
                <ScrollView style={styles.shops} horizontal={true}>
                    {JSON.parse(card.shops).map((shop, index) => (
                        <View key={index} style={styles.box}>
                            <TouchableOpacity
                                style={styles.shopBox}
                                onPress={() => openWebBrowser(shop.url)}
                            >
                                <Text style={styles.shopText}>{shop.name}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </View>
            <Image
                source={card.url}
                style={styles.image}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    // add marginBottom to raise image
    card: {
        flex: 1,
        backgroundColor: "black",
    },
    image: {
        width: screenWidth,
        height: "100%",
        contentFit: "contain",
    },
    buttonsContainer: {
        position: "absolute",
        zIndex: 10,
        right: (screenWidth * 1) / 30,
        top: (screenHeight * 5) / 8,
        justifyContent: "center",
    },
    descriptionText: {
        fontSize: 18,
        color: "rgba(256, 256, 256, 0.85)",
        fontFamily: "JosefinSans_400Regular",
    },
    usernameText:{
        fontSize: 18,
        color: "rgba(256, 256, 256, 0.85)",
        fontFamily: "JosefinSans_400Regular",
        marginBottom: 3,
    },
    shops: {
        marginTop: 20,
        width: "100%",
    },
    shopBox: {
        backgroundColor: "rgba(256, 256, 256, 0.9)",
        borderRadius: 30,
        marginRight: 4,
        paddingHorizontal: 5,
        paddingVertical: 2,
    },
    shopText: {
        color: "rgba(0, 0, 0, 0.5)",
    },
    fieldsContainer: {
        position: "absolute",
        justifyContent: "center",
        top: (screenHeight * 10.4) / 13,
        paddingLeft: 10,
        zIndex: 1,
    },
});
