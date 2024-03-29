import { View, Text } from 'react-native'
import Header from '../components/HomeScreen/Header'
import Discover from '../components/HomeScreen/Discover'
import React, { useEffect, useState } from 'react'
import { app } from '../../firebaseConfig';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { collection, getFirestore, getDocs } from "firebase/firestore";

export default function HomeScreen() {

  // database and collection
  const db = getFirestore(app);
  const storage = getStorage();

  //states
  const [cards, setCards]=useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    getCards();
  }, [])

  // get cards
  const getCards = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'UserPost'));
      const fetchedCards = [];
      querySnapshot.forEach((doc) => {
        fetchedCards.push(doc.data());
      });
      setCards(fetchedCards);
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setLoading(false); // Update loading state regardless of success/failure
    }
  };
  console.log({cards});
  return (
    <View>
      {/* <Header/> */}
      {!cards? 
        <ActivityIndicator color='#fff'/>
      :
        <Discover latestCards={cards}/>
      }
      
    </View>
  )
}