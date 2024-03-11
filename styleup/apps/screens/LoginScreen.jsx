import { View, Text, Image } from 'react-native'
import React from 'react'

export default function LoginScreen() {
  return (
    <View>
      <Image source={require('./../../assets/images/online-fashion-shopping-collage.jpg')}
            className='w-full h-4/5'
      />
    </View>
  )
}