import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { Image } from 'expo-image';
import React, { useState, useEffect } from "react";
import {
    useFonts,
    JosefinSans_700Bold,
    JosefinSans_100Thin,
} from "@expo-google-fonts/josefin-sans";
import { useNavigation } from "@react-navigation/native";
import { FlatGrid } from "react-native-super-grid";
import { Feather } from "@expo/vector-icons";

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
        setLoading(true);
        try {
            const response = await fetch(
                `https://3cc7-2600-1700-3680-2110-c494-b15d-2488-7b57.ngrok-free.app/collections/${user.id}`
            );
            const collectionsData = await response.json();
            // Add addButton to end of collections
            if (collectionsData && collectionsData.collections) {
                const collectionsWithAddButton = [
                    ...collectionsData.collections,
                    { isAddButton: true },
                ];
                setUserCollections(collectionsWithAddButton);
            }
        } catch (error) {
            console.error("Error fetching collection data", error);
        }
    };

    const handleAddCollection = async () => {
        const newCollection = {
            title: "",
            description: "",
            posts: [],
            uri: "",
            createdAt: Date.now()
        };

        try {
            const response = await fetch(
                `https://3cc7-2600-1700-3680-2110-c494-b15d-2488-7b57.ngrok-free.app/collections/${user.id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newCollection),
                }
            );

            const result = await response.json();

            const addButtonIndex = userCollections.findIndex(
                (item) => item.isAddButton
            );

            // Create a copy of the current collections and insert the new collection just before the add button
            let updatedCollections = [...userCollections];
            if (addButtonIndex >= 0) {
                updatedCollections.splice(addButtonIndex, 0, newCollection);
            } else {
                updatedCollections.push(newCollection); // If no add button found, append at the end
            }

            setUserCollections(updatedCollections);

            navigation.navigate("add collection", {
                collection: result,
                user: user,
            });

            if (response.ok) {
                console.log("Collection added successfully:", result);
            } else {
                console.error("Failed to add collection:", result);
            }
        } catch (error) {
            console.error("Error sending POST request:", error);
        }
    };

    const onLoadEnd = () => {
        setLoading(false);
    };

    return (
        <FlatGrid
            data={userCollections}
            style={styles.gridView}
            spacing={10}
            itemDimension={170}
            renderItem={({ item, index }) => {
                if (item.isAddButton) {
                    return (
                        <TouchableOpacity
                            style={styles.addItemContainer}
                            onPress={() => {
                                handleAddCollection(index);
                            }}
                        >
                            <Feather
                                name="plus-circle"
                                size={60}
                                color="#C4C4C4"
                            />
                        </TouchableOpacity>
                    );
                }

                return (
                    <TouchableOpacity
                        style={styles.itemContainer}
                        onPress={() => navigation.navigate("view collection", {
                            collectionId: item.id,
                            user: user,
                        })}
                    >
                        {item.uri ? (
                        <Image
                            source={item.uri}
                            onLoadEnd={onLoadEnd}
                            style={styles.image}
                        />
                    ) : (
                        <View>
                        </View>
                    )}
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>
                                {item.title
                                    ? item.title
                                    : `collection ${index + 1}`}
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            }}
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
        paddingVertical: 2,
        borderRadius: 4,
        backgroundColor: "rgba(256,256,256,0.5)",
        justifyContent: 'center',
    },
    itemContainer: {
        flex: 1,
        backgroundColor: "#C4C4C4",
        height: 181,
        width: 181,
        borderRadius: 4,
    },
    addItemContainer: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(196, 196, 196, 0.2)",
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
        contentFit: "cover",
        borderRadius: 4,
    },
});
