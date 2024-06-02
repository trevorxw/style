import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Button,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    KeyboardAvoidingView,
} from "react-native";
import { Formik } from "formik";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "@clerk/clerk-expo";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Feather } from "@expo/vector-icons";
import { app } from "../../../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { fetchWithTimeout } from "../../../utils/fetchWithTimeout";

export default function AddPostScreen() {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const db = getFirestore(app);
    const storage = getStorage();
    const { user } = useUser();
    const [categoryList, setCategoryList] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const getCategoryList = async () => {
            const querySnapshot = await getDocs(collection(db, "Category"));
            const fetchedCategories = [];
            querySnapshot.forEach((doc) => {
                fetchedCategories.push(doc.data());
            });
            setCategoryList(fetchedCategories);
        };

        getCategoryList();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const onSubmitMethod = async (values) => {
        setLoading(true);
        try {
            // Convert local image URI to blob if it's from the image picker
            const resp = await fetch(image);
            const blob = await resp.blob();

            // Create a FormData object to encapsulate the file data
            let formData = new FormData();
            formData.append("file", {
                uri: image,
                name: `post_${Date.now()}`,
                type: "image/jpeg",
            });

            // Append other form values that you want to send along with the file
            formData.append("description", values.desc);
            // formData.append("price", values.price);
            formData.append("shop_url", values.shop_url);
            formData.append("category", values.category);

            // Post request to Flask endpoint
            const response = await fetchWithTimeout(
                `https://5025-2600-1700-3680-2110-7567-7952-aacc-8b36.ngrok-free.app/upload/${user.id}`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const result = await response.json();
            if (response.ok) {
                Alert.alert("Success!", "Post Added Successfully.");
            } else {
                Alert.alert("Error", result.message || "An error occurred");
            }
        } catch (error) {
            console.error("Error uploading post", error);
            Alert.alert("Error", "Failed to upload post.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <ScrollView>
                <Formik
                    initialValues={{
                        desc: "",
                        shop_url: "",
                        price: "",
                        category: "",
                        createdAt: Date.now(),
                        likes: 0,
                        shares: 0,
                    }}
                    onSubmit={(values) => onSubmitMethod(values)}
                >
                    {({ handleChange, handleBlur, handleSubmit, values }) => (
                        <View>
                            <View style={styles.imagePickerContainer}>
                                <TouchableOpacity onPress={pickImage}>
                                    {image ? (
                                        <Image
                                            source={{ uri: image }}
                                            style={styles.image}
                                        />
                                    ) : (
                                        <Image
                                            source={require("../../../assets/images/placeholder.jpg")}
                                            style={styles.image}
                                        />
                                    )}
                                </TouchableOpacity>
                            </View>
                            <View style={styles.navIconsContainer}>
                                <TouchableOpacity
                                    onPress={() => [
                                        navigation.navigate("preview", {
                                            image: image,
                                        }),
                                    ]}
                                    className=""
                                    style={styles.navIcons}
                                >
                                    <Feather
                                        name="eye"
                                        size={18}
                                        color="black"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => [
                                        navigation.navigate("camera"),
                                    ]}
                                    className=""
                                    style={styles.navIcons}
                                >
                                    <Feather
                                        name="camera"
                                        size={18}
                                        color="black"
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.desc}>
                                <TextInput
                                    style={styles.descInput}
                                    placeholder="description (optional)"
                                    multiline
                                    numberOfLines={4}
                                    onChangeText={handleChange("description")}
                                />
                                <Text style={styles.linkHeader}>
                                    LINKS: (max 5)
                                </Text>
                            </View>
                            <View style={styles.linksContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Price"
                                    keyboardType="numeric"
                                    onChangeText={handleChange("price")}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Shop Address"
                                    onChangeText={handleChange("shop_url")}
                                />
                            </View>
                            <View style={styles.tags}>
                                <Text style={styles.tagsText}>Tags:</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="#xxx ..."
                                    onChangeText={handleChange("url")}
                                />
                            </View>
                            {loading ? (
                                <ActivityIndicator color="#0000ff" />
                            ) : (
                                <TouchableOpacity
                                    onPress={handleSubmit}
                                    style={styles.submitButton}
                                >
                                    <Text style={styles.submitButtonText}>
                                        Submit
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </Formik>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imagePickerContainer: {
        alignItems: "center",
        marginTop: 43,
    },
    image: {
        width: 300,
        height: 300,
        borderRadius: 15,
    },
    navIconsContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },
    navIcons: {
        marginHorizontal: 12,
        padding: 7,
        borderWidth: 1.5,
        borderRadius: 10,
    },
    desc: {
        marginTop: 10,
        paddingHorizontal: 20,
    },
    descInput: {
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        fontSize: 17,
    },
    linkHeader: {
        marginVertical: 10,
        fontFamily: "Cochin",
        fontSize: 20,
    },
    linksContainer: {
        paddingHorizontal: 40,
    },
    input: {
        marginVertical: 5,
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        fontSize: 17,
    },
    submitButton: {
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 10,
        margin: 20,
    },
    submitButtonText: {
        color: "#ffffff",
        textAlign: "center",
        fontSize: 16,
    },
    tags: {
        flex: 1,
        flexDirection: "row",
        marginTop: 10,
        paddingHorizontal: 20,
    },
    tagsText: {
        marginVertical: 10,
        fontFamily: "Cochin",
        fontSize: 20,
        marginRight: 20,
    },
});
