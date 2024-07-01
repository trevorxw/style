import React, { useState, useEffect } from "react";
import {
    Alert,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import {
    useFonts,
    JosefinSans_400Regular,
} from "@expo-google-fonts/josefin-sans";
import { Feather } from "@expo/vector-icons";
import { FlatGrid } from "react-native-super-grid";
import { Formik } from "formik";
import * as ImagePicker from "expo-image-picker";
import { fetchWithTimeout } from "../../../utils/fetchWithTimeout";
import { getFirebaseToken } from "../../../utils";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function AddCollection({ route, navigation }) {
    let [fontsLoaded] = useFonts({
        JosefinSans_400Regular,
    });
    const { user, collectionId } = route.params;
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [userSwipedPosts, setSwipedPosts] = useState([]);
    const [selectedPosts, setSelectedPosts] = useState(new Set());

    const numColumns = 3;

    useEffect(() => {
        if (user) {
            getUserLikes();
        }
    }, [user]);

    useEffect(() => {
        if (selectedPosts.size > 0) {
            updateCollectionPosts();
        }
    }),
        [selectedPosts];

    const getUserLikes = async () => {
        const posts = [];

        // Fetch details for each post using the post ID
        try {
            const token = await getFirebaseToken();
            const response = await fetch(
                `https://fitpic-flask-ys4dqjogsq-wl.a.run.app/likes/${user.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const likesData = await response.json();
            console.log(`Getting likes for user ${user.id}: ${likesData}`);
            for (const post of likesData) {
                try {
                    const response = await fetch(
                        `https://fitpic-flask-ys4dqjogsq-wl.a.run.app/cards/${post.post_id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    const postData = await response.json();
                    const enrichedPostData = { ...postData, ...post };
                    if (postData) {
                        posts.push(enrichedPostData);
                    }
                } catch (error) {
                    console.error("Error fetching post data", error);
                }
            }
        } catch (error) {
            console.error("Error fetching user likes data", error);
        }
        console.log("user liked posts: ", posts);
        setSwipedPosts(posts);
    };

    const pickImage = async () => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert(
                "Give access to camera roll permissions to share your photos!"
            );
            return;
        }
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

    const toggleSelection = (postId) => {
        setSelectedPosts((currentSelectedPosts) => {
            const newSelectedPosts = new Set(currentSelectedPosts);
            if (newSelectedPosts.has(postId)) {
                newSelectedPosts.delete(postId);
            } else {
                newSelectedPosts.add(postId);
            }
            return newSelectedPosts;
        });
    };

    const updateCollectionPosts = async () => {
        try {
            let formData = new FormData();
            formData.append("posts", JSON.stringify([...selectedPosts]));
            // Post request to Flask endpoint
            const token = await getFirebaseToken();
            const response = await fetchWithTimeout(
                `https://fitpic-flask-ys4dqjogsq-wl.a.run.app/collection/${user.id}/${collectionId}`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
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
        setLoading(true);
        try {
            // Create a FormData object to encapsulate the file data
            let formData = new FormData();
            formData.append("file", {
                uri: image,
                name: `post_${Date.now()}.jpg`,
                type: "image/jpeg",
            });

            // Append other form values that you want to send along with the file
            formData.append("description", values.description);
            formData.append("createdAt", values.createdAt);
            formData.append("title", values.title);
            console.log("formData", formData);
            // Post request to Flask endpoint
            const token = await getFirebaseToken();
            const response = await fetch(
                `https://fitpic-flask-ys4dqjogsq-wl.a.run.app/collection/${user.id}/${collectionId}`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const result = await response.json();
            console.log(result);
            if (response.ok) {
                clearImage();
                Alert.alert("Success!", "Collection Added Successfully.");
                navigation.navigate("profile-tab", { from: "add collection" });
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
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Formik
                initialValues={{
                    description: "",
                    createdAt: Date.now(),
                    title: "",
                }}
                onSubmit={(values, { resetForm }) => {
                    onSubmitMethod(values);
                    resetForm();
                }}
            >
                {({ handleChange, handleSubmit, values }) => (
                    <View>
                        <View style={styles.headerContainer}>
                            <View style={styles.placeholder}></View>
                            <Text style={styles.headerText}>collection</Text>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleSubmit}
                                disabled={loading}
                            >
                                <Feather name="check" size={30} color="black" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputContainer}>
                            <View style={styles.imageContainer}>
                                {image ? (
                                    <TouchableOpacity
                                        style={styles.image}
                                        onPress={pickImage}
                                    >
                                        <Image
                                            source={image}
                                            style={styles.coverImage}
                                        />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity
                                        style={styles.coverImage}
                                        onPress={pickImage}
                                    >
                                        <Text style={styles.imageText}>
                                            add cover photo
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                            <View style={styles.textContainer}>
                                <TextInput
                                    style={styles.nameInput}
                                    placeholder="name"
                                    placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                                    onChangeText={handleChange("title")}
                                />
                                <TextInput
                                    style={styles.descInput}
                                    placeholder="description"
                                    placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                                    multiline
                                    blurOnSubmit
                                    onChangeText={handleChange("description")}
                                />
                            </View>
                        </View>
                    </View>
                )}
            </Formik>

            <View style={styles.divider}>
                {loading ? (
                    <View>
                        <ActivityIndicator size="medium" color="white" />
                        <Text style={styles.dividerText}>
                            This may take a while.
                        </Text>
                    </View>
                ) : (
                    <Text style={styles.dividerText}>select photos to add</Text>
                )}
            </View>

            <FlatGrid
                itemDimension={130}
                data={userSwipedPosts}
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
                        <TouchableOpacity
                            onPress={() => toggleSelection(item.post_id)}
                        >
                            <Image
                                source={[
                                    {
                                        uri: item.url,
                                        width: (screenWidth - 2) / 3,
                                        height: 150,
                                        scale: 1,
                                    },
                                ]}
                                style={styles.image}
                            />

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
    },
    headerText: {
        fontSize: 30,
        textAlign: "center",
        fontWeight: "bold",
        fontFamily: "JosefinSans_700Bold",
    },
    placeholder: {
        width: 30,
        height: 24,
    },
    inputContainer: {
        height: 160,
        marginHorizontal: 20,
        flexDirection: "row",
    },
    imageContainer: {
        height: 145,
        width: 145,
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
    nameInput: {
        marginLeft: 15,
        marginBottom: 10,
        width: 190,
        height: 40,
        borderColor: "rgba(0, 0, 0, 0.5)",
        borderWidth: 1,
        fontSize: 20,
        fontFamily: "JosefinSans_400Regular",
        padding: 10,
        borderRadius: 4,
    },
    descInput: {
        marginLeft: 15,
        width: 190,
        height: 95,
        borderColor: "rgba(0, 0, 0, 0.5)",
        borderWidth: 1,
        fontSize: 20,
        fontFamily: "JosefinSans_400Regular",
        padding: 10,
        paddingBottom: 55,
        borderRadius: 4,
    },
    activityIndicator: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    divider: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#45B0FF",
        height: 42,
    },
    dividerText: {
        fontSize: 20,
        fontFamily: "JosefinSans_400Regular",
    },
    itemContainer: {
        marginTop: -5,
        justifyContent: "flex-end",
        height: 150,
    },
    image: {
        width: "100%",
        height: "100%",
        contentFit: "cover",
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
});
