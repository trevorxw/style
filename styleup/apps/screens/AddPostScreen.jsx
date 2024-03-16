import { View, Text, TextInput, StyleSheet, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { app } from '../../firebaseConfig';
import { getFirestore } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import { Formik } from 'formik';
import { Picker } from '@react-native-picker/picker';

export default function AddPostScreen() {

    // Initialize Cloud Firestore and get a reference to the service
    const db = getFirestore(app);
    const [categoryList,setCategoryList]=useState([]);
    useEffect(()=>{
        getCategoryList();
    },[])

    const getCategoryList=async()=>{
        setCategoryList([]);

        const querySnapshot=await getDocs(collection(db, 'Category'));

        querySnapshot.forEach((doc)=>{
            console.log("Docs:", doc.data());
            setCategoryList(categoryList=>[...categoryList,doc.data()])
        })
    }
    return (
        <View className="p-10">
            <Text className="text-[20px] font-bold mb-10 mt-10">Add New Post</Text>
            <Formik
                initialValues={{name:'', desc:'', category:'', url:'', price:'', image:''}}
                onSubmit={value=>console.log(value)}
            >
                {({handleChange,handleBlur,handleSubmit,values,setFieldValue})=>(
                    <View className="">
                        <TextInput
                            style={styles.input}
                            placeholder='Title'
                            value={values?.title}
                            onChangeText={handleChange('title')}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='Description'
                            value={values?.desc}
                            numberOfLines={5}
                            onChangeText={handleChange('desc')}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='Price'
                            value={values?.price}
                            keyboardType='numbers-and-punctuation'
                            onChangeText={handleChange('price')}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='Shop Address'
                            value={values?.url}
                            onChangeText={handleChange('url')}
                        />

                        <Picker
                            selectedValue={values?.category}
                            className="border-2"
                            onValueChange={itemValue=>setFieldValue('category',itemValue)}
                        >
                            {categoryList&&categoryList.map((item, index)=>(
                                <Picker.Item key={index} label={item.name} value={item.name}/>
                            ))}
                            
                        </Picker>

                        <Button onPress={handleSubmit} 
                        className="mt-7"
                        title='Submit'/>
                    </View>
                )}
            </Formik>
        </View>
    )
}

const styles = StyleSheet.create({
    input:{
        borderWidth:1,
        borderRadius:10,
        padding:10,
        paddingTop:15,
        marginTop:10,
        marginBottom:5,
        paddingHorizontal:17,
        textAlignVertical:'top',
        fontSize:17
    }
})