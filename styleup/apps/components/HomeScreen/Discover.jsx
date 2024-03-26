import { View, Text, StyleSheet, Button, Image, ActivityIndicator } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import React from 'react';
import Header from './Header';

export default function Discover({ latestCards }) {
  console.log({ latestCards });

  if (!latestCards || latestCards.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#4FD0E9" size="large" />
      </View>
    );
  }

  return (
    <Swiper
      className='h-full w-full object-cover flex'
      cards={latestCards}
      renderCard={(card) => {
        console.log(card);
        return (
          <View style={styles.card}>
            <Image
              source={{ uri: card.image }}
              style={styles.image}
            />
            {/* <Text style={styles.text}>hi</Text> */}
          </View>
        );
      }}
      onSwiped={(cardIndex) => { console.log(cardIndex); }}
      onSwipedAll={() => { console.log('onSwipedAll'); }}
      cardIndex={0}
      backgroundColor={'#4FD0E9'}
      stackSize={3}
      verticalSwipe={false}
    >
      <Header />
      <Button
        onPress={() => { console.log('oulala'); }}
        title="Press me">
        You can press me
      </Button>
    </Swiper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#E8E8E8",
    justifyContent: "center",
    backgroundColor: "white"
  },
  image: {
    width: '100%',
    height: 400,
    resizeMode: 'cover'
  },
  text: {
    textAlign: "center",
    fontSize: 40,
    backgroundColor: "transparent"
  }
});
