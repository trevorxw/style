import React, { useContext, useState } from "react";
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
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { getFirebaseToken } from "../../../utils";
import { AuthenticatedUserContext } from "../../providers";
import { useNavigation } from "@react-navigation/native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Post({ card, swipeRight }) {
    navigation = useNavigation();

    const { user, loading, error } = useFetchUser(card.user_id);
    const { user: userFirebase } = useContext(AuthenticatedUserContext);
    const [showDeleteButton, setShowDeleteButton] = useState(false);

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

    const handleDelete = async () => {
        try {
            const token = await getFirebaseToken();
            const response = await fetch(
                `https://fitpic-flask-ys4dqjogsq-wl.a.run.app/post/${user.id}/${card.post_id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const result = await response.json();
            if (response.ok) {
                Alert.alert("Success!", "Post Deleted Successfully.");
                navigation.navigate("profile-tab", {
                    from: "edited collection",
                });
            } else {
                Alert.alert("Error", result.message || "An error occurred");
            }
        } catch (error) {
            console.error("Error deleting post", error);
            Alert.alert("Error", "Failed to delete post.");
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.buttonsContainer}>
                {showDeleteButton && card.user_id === userFirebase.uid ? (
                    <View style={styles.deleteButtonContainer}>
                        <TouchableOpacity
                            onPress={() => {
                                Alert.alert(
                                    "Confirm Deletion", // Title
                                    "Are you sure you want to delete this post?", // Message
                                    [
                                        {
                                            text: "Cancel",
                                            onPress: () =>
                                                console.log(
                                                    "Deletion cancelled"
                                                ),
                                            style: "cancel",
                                        },
                                        {
                                            text: "Delete",
                                            onPress: () => handleDelete(), // Call the delete function on confirmation
                                            style: "destructive",
                                        },
                                    ],
                                    { cancelable: false } // Make the dialog non-cancelable outside of its buttons
                                );
                            }}
                        >
                            <Feather name="trash-2" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View></View>
                )}
                <ProfilePicture user={user} />
                <Like card={card} swipeRight={swipeRight} />
                {/* <Share card={card} /> */}
            </View>
            <View style={styles.fieldsContainer}>
                <TouchableOpacity
                    onLongPress={() => setShowDeleteButton(!showDeleteButton)}
                >
                    <Text style={styles.usernameText}>@{user.username}</Text>
                </TouchableOpacity>

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
            <Image source={card.url} style={styles.image} />
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
    usernameText: {
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
    deleteButtonContainer: {
        position: "absolute",
        top: -40,
        right: 5,
        zIndex: 1,
        backgroundColor: "rgba(256,256,256,0.7)",
        padding: 3,
        borderRadius: 6,
    },
});
