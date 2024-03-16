import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { app } from '../../firebaseConfig';
import { getFirestore } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";

export default function AddPostScreen() {

    // Initialize Cloud Firestore and get a reference to the service
    const db = getFirestore(app);
    const [categoryList,setCategoryList]=useState([]);
    useEffect(()=>{
        getCategoryList();
    },[])

    const getCategoryList=async()=>{
        const querySnapshot=await getDocs(collection(db, 'Category'));

        querySnapshot.forEach((doc)=>{
            console.log("Docs:", doc.data());
            setCategoryList(categoryList=>[...categoryList,doc.data()])
        })
    }
    return (
        <View>
            <Text>AddPostScreen</Text>
        </View>
    )
}