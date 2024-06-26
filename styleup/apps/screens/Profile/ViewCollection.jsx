import React, { useState, useEffect } from "react";
import {
    Alert,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import {
    useFonts,
    JosefinSans_400Regular,
} from "@expo-google-fonts/josefin-sans";
import { Feather, Ionicons } from "@expo/vector-icons";
import { FlatGrid } from "react-native-super-grid";
import { Formik } from "formik";
import * as ImagePicker from "expo-image-picker";
import { fetchWithTimeout } from "../../../utils/fetchWithTimeout";

export default function ViewCollection({ route, navigation }) {
    let [fontsLoaded] = useFonts({
        JosefinSans_400Regular,
    });
    const { user, collectionId } = route.params;
    const [loading, setLoading] = useState(false);
    const [collection, setCollection] = useState({});
    const [collectionPosts, setCollectionPosts] = useState([]);

    const [swipedPosts, setSwipedPosts] = useState([]);
    const [selectedPosts, setSelectedPosts] = useState(new Set());

    const [addingPhotos, setAddingPhotos] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [image, setImage] = useState(null);

    const numColumns = 3;

    useEffect(() => {
        if (user) {
            getUserLikes();
            getCollectionData();
        }
    }, [user]);

    useEffect(() => {
        if (addingPhotos) {
            updateCollectionPosts();
        }
    }),
        [selectedPosts];


    const getCollectionData = async () => {
        // Fetch details for each post using the post ID
        try {
            const response = await fetch(
                `https://3cc7-2600-1700-3680-2110-c494-b15d-2488-7b57.ngrok-free.app/collection/${user.id}/${collectionId}`
            );
            const collectionData = await response.json();
            console.log(
                `Opening collection ${collectionId}.\nposts: ${collectionData.posts}\nTitle: ${collectionData.title}, Description: ${collectionData.description}`
            );
            let postIds = [];
            if (collectionData.posts && collectionData.posts.length > 0) {
                try {
                    // Attempt to parse the posts if they are in string format
                    postIds = JSON.parse(collectionData.posts);
                } catch (parseError) {
                    console.error("Error parsing posts JSON:", parseError);
                    postIds = []; // Default to an empty array if parsing fails
                }
            }

            const posts = [];
            for (const post_id of postIds) {
                if (post_id) {
                    try {
                        const postResponse = await fetch(
                            `https://3cc7-2600-1700-3680-2110-c494-b15d-2488-7b57.ngrok-free.app/cards/${post_id}`
                        );
                        const postData = await postResponse.json();
                        if (postData) {
                            const enrichedPostData = { ...postData, post_id };
                            selectedPosts.add(post_id);
                            posts.push(enrichedPostData);
                        }
                    } catch (fetchError) {
                        console.error(
                            "Error fetching post data for ID:",
                            post_id,
                            fetchError
                        );
                    }
                }
            }

            setCollection(collectionData);
            setCollectionPosts(posts);
        } catch (error) {
            console.error("Error fetching collection data", error);
        }
    };

    const getUserLikes = async () => {
        const posts = [];

        // Fetch details for each post using the post ID
        try {
            const response = await fetch(
                `https://3cc7-2600-1700-3680-2110-c494-b15d-2488-7b57.ngrok-free.app/likes/${user.id}`
            );
            const likesData = await response.json();
            // console.log(likesData);
            for (const post of likesData) {
                try {
                    const response = await fetch(
                        `https://3cc7-2600-1700-3680-2110-c494-b15d-2488-7b57.ngrok-free.app/cards/${post.post_id}`
                    );
                    const postData = await response.json();
                    const enrichedPostData = { ...postData, ...post };
                    if (postData) {
                        posts.push(enrichedPostData);
                    }
                } catch (error) {
                    console.error("Error fetching user liked data", error);
                }
            }
        } catch (error) {
            console.error("Error fetching user liked data", error);
        }

        setSwipedPosts(posts);
    };

    const updateCollectionPosts = async () => {
        try {
            let formData = new FormData();
            formData.append("posts", JSON.stringify([...selectedPosts]));
            // Post request to Flask endpoint
            const response = await fetchWithTimeout(
                `https://3cc7-2600-1700-3680-2110-c494-b15d-2488-7b57.ngrok-free.app/collection/${user.id}/${collectionId}`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const result = await response.json();
            if (response.ok) {
            } else {
                Alert.alert("Error", result.message || "An error occurred");
            }
        } catch (error) {
            if (error.name === "AbortError") {
                console.error("Fetch aborted:", error);
                Alert.alert("Error", "Request timed out, please try again");
            } else {
                console.error("Error editing collection", error);
                Alert.alert("Error", "Failed to edit collection.");
            }
        } finally {
        }
    };

    const onSubmitMethod = async (values) => {
        if (
            values.title !== collection.title ||
            values.description !== collection.description ||
            image
        ) {
            setLoading(true);
            let formData = new FormData();
            formData.append("description", values.description);
            formData.append("title", values.title);
            if (image) {
                formData.append("file", {
                    uri: image,
                    name: `post_${Date.now()}.jpg`,
                    type: "image/jpeg",
                });
            }

            try {
                // Post request to Flask endpoint
                const response = await fetch(
                    `https://3cc7-2600-1700-3680-2110-c494-b15d-2488-7b57.ngrok-free.app/collection/${user.id}/${collectionId}`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                const result = await response.json();
                if (response.ok) {
                    Alert.alert("Success!", "Collection Edited Successfully.");
                } else {
                    Alert.alert("Error", result.message || "An error occurred");
                }
            } catch (error) {
                if (error.name === "AbortError") {
                    console.error("Fetch aborted:", error);
                    Alert.alert("Error", "Request timed out, please try again");
                } else {
                    console.error("Error editing collection", error);
                    Alert.alert("Error", "Failed to edit collection.");
                }
            } finally {
            }
            setLoading(false);
            navigation.navigate("profile-tab", { from: "edited collection" });
        }
    };

    const deleteCollection = async () => {
        try {
            const response = await fetch(
                `https://3cc7-2600-1700-3680-2110-c494-b15d-2488-7b57.ngrok-free.app/collection/${user.id}/${collectionId}`,
                {
                    method: "DELETE",
                }
            );
            const result = await response.json();
            if (response.ok) {
                Alert.alert("Success!", "Collection Deleted Successfully.");
                navigation.navigate("profile-tab", {
                    from: "edited collection",
                });
            } else {
                Alert.alert("Error", result.message || "An error occurred");
            }
        } catch (error) {
            console.error("Error deleting collection", error);
            Alert.alert("Error", "Failed to delete collection.");
        }
    };

    const toggleSelection = (post) => {
        setSelectedPosts((currentSelectedPosts) => {
            const newSelectedPosts = new Set(currentSelectedPosts); // Creating a new set from the current state

            if (newSelectedPosts.has(post.post_id)) {
                newSelectedPosts.delete(post.post_id); // Remove the post if it's already selected
                // Update collectionPosts to remove the post
                setCollectionPosts((current) =>
                    current.filter((p) => p.post_id !== post.post_id)
                );
            } else {
                newSelectedPosts.add(post.post_id); // Add the post if it's not selected
                // Add the post to collectionPosts
                setCollectionPosts((current) => [post, ...current]);
            }
            return newSelectedPosts;
        });
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [1, 1],
            quality: 0.2,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const clearImage = () => {
        setImage(null);
    };

    return (
        <View style={styles.container}>
            <Formik
                initialValues={{
                    description: collection.description || "",
                    title: collection.title || "",
                }}
                enableReinitialize={true}
                onSubmit={(values, { resetForm }) => {
                    onSubmitMethod(values);
                }}
            >
                {({ handleChange, handleSubmit, values }) => (
                    <View>
                        <View style={styles.headerContainer}>
                            <View style={styles.placeholder}></View>
                            <TextInput
                                style={styles.headerText}
                                value={values.title}
                                placeholder={
                                    collection.title != ""
                                        ? ""
                                        : "collection name"
                                }
                                onChangeText={handleChange("title")}
                                editable={isEditing}
                                selectTextOnFocus={isEditing}
                            />
                            {isEditing ? (
                                <TouchableOpacity
                                    onPress={() => {
                                        handleSubmit();
                                        setIsEditing(!isEditing);
                                    }}
                                >
                                    <Feather
                                        name="check"
                                        size={30}
                                        color="black"
                                    />
                                </TouchableOpacity>
                            ) : (
                                <View style={styles.placeholder}></View>
                            )}
                        </View>

                        <View style={styles.inputContainer}>
                            <View style={styles.imageContainer}>
                                <TouchableOpacity
                                    style={styles.coverImage}
                                    onPress={() => {
                                        pickImage();
                                    }}
                                    disabled={!isEditing}
                                >
                                    {image ? (
                                        <Image
                                            source={image}
                                            style={styles.coverImage}
                                        />
                                    ) : collection.uri ? (
                                        <Image
                                            source={collection.uri}
                                            style={styles.coverImage}
                                        />
                                    ) : (
                                        <View style={styles.coverImage}></View>
                                    )}
                                </TouchableOpacity>
                            </View>
                            <View style={styles.textContainer}>
                                <TextInput
                                    style={styles.descInput}
                                    value={values.description}
                                    placeholder={
                                        collection.description != ""
                                            ? ""
                                            : "description of collection :)"
                                    }
                                    onChangeText={handleChange("description")}
                                    multiline
                                    blurOnSubmit
                                    editable={isEditing}
                                    selectTextOnFocus={isEditing}
                                />
                            </View>
                        </View>
                        <View style={styles.buttons}>
                            <TouchableOpacity
                                onPress={() => {
                                    setAddingPhotos(!addingPhotos);
                                }}
                            >
                                <Feather
                                    name="plus-circle"
                                    size={25}
                                    color="#45B0FF"
                                />
                            </TouchableOpacity>
                            {loading ? (
                                <ActivityIndicator size="small" />
                            ) : (
                                <View></View>
                            )}
                            {isEditing ? (
                                <TouchableOpacity
                                    onPress={() => {
                                        setIsEditing(!isEditing);
                                        Alert.alert(
                                            "Confirm Deletion", // Title
                                            "Are you sure you want to delete this collection?", // Message
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
                                                    onPress: () =>
                                                        deleteCollection(), // Call the delete function on confirmation
                                                    style: "destructive",
                                                },
                                            ],
                                            { cancelable: false } // Make the dialog non-cancelable outside of its buttons
                                        );
                                    }}
                                >
                                    <Text style={styles.editButton}>
                                        delete collection
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    onPress={() => {
                                        setIsEditing(!isEditing);
                                    }}
                                >
                                    <Text style={styles.editButton}>EDIT</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )}
            </Formik>
            {/* <View style={styles.divider}></View> */}

            <FlatGrid
                itemDimension={130}
                data={addingPhotos ? swipedPosts : collectionPosts}
                style={styles.gridView}
                spacing={0}
                renderItem={({ item, index }) => (
                    <View
                        style={[
                            styles.itemContainer,
                            {
                                marginRight:
                                    (index + 1) % numColumns === 0 ? 0 : 1, // Right margin for items not in the last column
                                marginBottom: 1, // Bottom margin for all items
                            },
                        ]}
                    >
                        {addingPhotos ? (
                            <TouchableOpacity
                                onPress={() => toggleSelection(item)}
                            >
                                <Image source={item.url} style={styles.image} />

                                {selectedPosts.has(item.post_id) && (
                                    <View style={styles.selectionOverlay}>
                                        <Feather
                                            name="check-circle"
                                            size={42}
                                            color="white"
                                        />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate("post", {
                                        post: item,
                                    })
                                }
                            >
                                <Image source={item.url} style={styles.image} />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        marginTop: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: 15,
        marginBottom: 10,
        height: 30,
    },
    headerText: {
        fontSize: 30,
        textAlign: "center",
        fontWeight: "bold",
        fontFamily: "JosefinSans_700Bold",
        color: "black",
    },
    placeholder: {
        width: 30,
    },
    inputContainer: {
        height: 152,
        marginHorizontal: 20,
        flexDirection: "row",
    },
    imageContainer: {
        height: 145,
        width: 145,
        borderRadius: 4,
    },
    coverImage: {
        height: 145,
        width: 145,
        backgroundColor: "rgba(196, 196, 196, 0.22)",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
    },
    imageText: {
        width: 100,
        fontSize: 20,
        textAlign: "center",
        fontFamily: "JosefinSans_400Regular",
    },
    gridView: {
        flex: 1,
    },
    itemContainer: {
        flex: 1,
        justifyContent: "flex-end",
        height: 150,
    },
    descInput: {
        marginLeft: 15,
        width: 190,
        height: 145,
        borderColor: "rgba(0, 0, 0, 0.5)",
        borderWidth: 1,
        fontSize: 20,
        fontFamily: "JosefinSans_400Regular",
        padding: 10,
        borderRadius: 4,
    },
    activityIndicator: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    itemContainer: {
        justifyContent: "flex-end",
        height: 150,
    },
    image: {
        width: "100%",
        height: "100%",
        contentFit: "cover",
        backgroundColor: "#C4C4C4",
    },
    selectionOverlay: {
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        right: 0,
        alignItems: "center",
        justifyContent: "center",
        padding: 5,
        backgroundColor: "rgba(207, 232, 255, 0.5)",
    },
    divider: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#45B0FF",
        height: 42,
    },
    buttons: {
        justifyContent: "space-between",
        flexDirection: "row",
        marginHorizontal: 20,
        marginBottom: 5,
        alignItems: "center",
    },
    editButton: {
        fontSize: 20,
        fontFamily: "JosefinSans_700Bold",
    },
});
