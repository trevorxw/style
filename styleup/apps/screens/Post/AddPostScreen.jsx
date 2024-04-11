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
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const onSubmitMethod = async (values) => {
        setLoading(true);
        const resp = await fetch(image);
        const blob = await resp.blob();
        const storageRef = ref(storage, `communityPost/${Date.now()}.jpg`);

        uploadBytes(storageRef, blob).then(() => {
            getDownloadURL(storageRef).then(async (downloadUrl) => {
                values.image = downloadUrl;
                values.userId = user.id;
                values.userImage = user.imageUrl;
                await addDoc(collection(db, "UserPost"), values);
                setLoading(false);
                Alert.alert("Success!", "Post Added Successfully.");
            });
        });
    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <ScrollView>
                <Formik
                    initialValues={{
                        name: "",
                        desc: "",
                        url: "",
                        price: "",
                        image: "",
                        category: "",
                        userName: "",
                        userImage: "",
                        createdAt: Date.now(),
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
                                <TouchableOpacity
                                    onPress={() => [
                                        navigation.navigate("camera"),
                                    ]}
                                    className=""
                                    style={styles.cameraButton}
                                >
                                    <Feather
                                        name="camera"
                                        size={24}
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
                                    onChangeText={handleChange("desc")}
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
                                    onChangeText={handleChange("url")}
                                />
                                {/* Category Picker commented out for brevity */}
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
    cameraButton: {
        marginTop: 10,
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
        marginTop: 20,
    },
    submitButtonText: {
        color: "#ffffff",
        textAlign: "center",
        fontSize: 16,
    },
});
