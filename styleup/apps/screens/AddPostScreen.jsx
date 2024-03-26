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
import React, { useEffect, useState } from "react";
import { app } from "../../firebaseConfig";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { Formik } from "formik";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "@clerk/clerk-expo";

export default function AddPostScreen() {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Initialize Cloud Firestore and Database and get a reference to the service
    const db = getFirestore(app);
    const storage = getStorage();

    // Retrieve user information
    const { user } = useUser();

    const [categoryList, setCategoryList] = useState([]);
    useEffect(() => {
        getCategoryList();
    }, []);

    const getCategoryList = async () => {
        setCategoryList([]);

        const querySnapshot = await getDocs(collection(db, "Category"));

        querySnapshot.forEach((doc) => {
            // console.log("Docs:", doc.data());
            setCategoryList((categoryList) => [...categoryList, doc.data()]);
        });
    };
    // Used to Pick Image from Gallery
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsMultipleSelection: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const onSubmitMethod = async (value) => {
        setLoading(true);

        //convert uri to blob file
        const resp = await fetch(image);
        const blob = await resp.blob();
        const storageRef = ref(storage, "communityPost/" + Date.now() + ".jpg");

        // 'file' comes from the Blob or File API
        uploadBytes(storageRef, blob)
            .then((snapshot) => {
                console.log("Uploaded a blob or file!");
            })
            .then((resp) => {
                getDownloadURL(storageRef).then(async (downloadUrl) => {
                    console.log(downloadUrl);
                    value.image = downloadUrl;
                    value.userId = user.id;
                    value.userImage = user.imageUrl;
                    const docRef = await addDoc(
                        collection(db, "UserPost"),
                        value
                    );
                    if (docRef.id) {
                        setLoading(false);
                        Alert.alert("Success!", "Post Added Sucessfully.");
                    }
                });
            });
    };

    return (
        <KeyboardAvoidingView>
            <ScrollView className="">
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
                    onSubmit={(value) => onSubmitMethod(value)}
                >
                    {({
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        values,
                        setFieldValue,
                    }) => (
                        <ScrollView className="">
                            <View className=" flex flex-1 h-[300px] p-5">
                                <TouchableOpacity onPress={pickImage}>
                                    {image ? (
                                        <Image
                                            source={{ uri: image }}
                                            style={{
                                                width: 300,
                                                height: 400,
                                                borderRadius: 15,
                                            }}
                                        />
                                    ) : (
                                        <Image
                                            source={require("./../../assets/images/placeholder.jpg")}
                                            style={{
                                                width: "50%",
                                                height: 200,
                                                borderRadius: 15,
                                            }}
                                        />
                                    )}
                                </TouchableOpacity>
                            </View>
                            <View className="flex flex-1 p-5">
                                <TextInput
                                    style={styles.input}
                                    placeholder="Title"
                                    value={values?.title}
                                    onChangeText={handleChange("name")}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Description"
                                    value={values?.desc}
                                    numberOfLines={5}
                                    onChangeText={handleChange("desc")}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Price"
                                    value={values?.price}
                                    keyboardType="numbers-and-punctuation"
                                    onChangeText={handleChange("price")}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Shop Address"
                                    value={values?.url}
                                    onChangeText={handleChange("url")}
                                />

                                {/* <Picker
                                    selectedValue={values?.category}
                                    className="border-2"
                                    onValueChange={itemValue=>setFieldValue('category',itemValue)}
                                >
                                    {categoryList&&categoryList.map((item, index)=>(
                                        <Picker.Item key={index} label={item.name} value={item.name}/>
                                    ))}
                                    
                                </Picker> */}
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <TouchableOpacity
                                        onPress={handleSubmit}
                                        className="p-4 bg-blue-500 rounded-full mt-10"
                                        title="Submit"
                                        disabled={loading}
                                    >
                                        <Text className="text-white text-center text-[16px]">
                                            Submit
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </ScrollView>
                    )}
                </Formik>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        paddingTop: 15,
        marginTop: 10,
        marginBottom: 0,
        paddingHorizontal: 17,
        textAlignVertical: "top",
        fontSize: 17,
    },
});
