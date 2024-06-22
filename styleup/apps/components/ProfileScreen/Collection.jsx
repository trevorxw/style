import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
    useFonts,
    JosefinSans_700Bold,
    JosefinSans_100Thin,
} from "@expo-google-fonts/josefin-sans";
import { useNavigation } from "@react-navigation/native";
import { FlatGrid } from "react-native-super-grid";

export default function Collection({ user }) {
    let [fontsLoaded] = useFonts({
        JosefinSans_700Bold,
        JosefinSans_100Thin,
    });
    const navigation = useNavigation();
    const [userCollections, setUserCollections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            getUserCollections();
        }
    }, [user]);

    const getUserCollections = async () => {
        const collections = [];
        setLoading(true);

        try {
            const response = await fetch(
                `https://3cc7-2600-1700-3680-2110-c494-b15d-2488-7b57.ngrok-free.app/collections/${user.id}`
            );
            const collectionsData = await response.json();
            if (collectionsData && collectionsData.collections) {
                setUserCollections(collectionsData.collections); // Directly use the collections array from the response
            }
        } catch (error) {
            console.error("Error fetching collection data", error);
        }
    };

    const handleAddCollection = () => {
        setCurrentShop({ index: shops.length, name: "", url: "" });
        setIsEditing(true);
    };

    const onLoadEnd = () => {
        setLoading(false);
    };

    console.log(userCollections);

    return (
        <FlatGrid
            data={userCollections}
            style={styles.gridView}
            spacing={10}
            itemDimension={181}
            renderItem={({ item, index }) => (
                <TouchableOpacity>
                    <View style={styles.itemContainer}>
                        {item.uri !== "" ? (
                            <Image
                                source={{ uri: item.uri }}
                                onLoadEnd={onLoadEnd}
                                style={styles.image}
                            />
                        ) : (
                            <ActivityIndicator
                                style={styles.activityIndicator}
                                size="small"
                                color="#0000ff"
                            />
                        )}
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>
                                {item.title != ""
                                    ? item.title
                                    : `collection ${index + 1}`}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 30,
        backgroundColor: "#FFFF",
    },
    number: {
        fontSize: 25,
        textAlign: "center",
        fontWeight: "bold",
        fontFamily: "JosefinSans_700Bold",
    },
    text: {
        color: "black",
        fontFamily: "JosefinSans_400Regular",
        fontSize: 19,
    },
    textContainer: {
        position: "absolute",
        marginTop: 150,
        marginBottom: 20,
        marginLeft: 10,
        paddingHorizontal: 2,
        paddingVertical: 1,
        borderRadius: 4,
        backgroundColor: "rgba(256,256,256,0.5)",
    },
    itemContainer: {
        flex: 1,
        backgroundColor: "#C4C4C4",
        height: 181,
        width: 181,
        borderRadius: 4,
    },
    loading: {
        position: "absolute",
        top: 80,
        left: 80,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
        borderRadius: 4,
    },
});
