import { View, Text, TextInput } from 'react-native'
import React from 'react'
import { Ionicons} from '@expo/vector-icons';

export default function Header() {
  return (
    <View className="flex flex-row items-center bg-transparent rounded-full'
    ">
      <Ionicons name='search' size={24} color='gray'/>
      <TextInput placeholder='Search' className='ml-2 text-[18px]'
        onChangeText={(value)=>console.log(value)}
      />
    </View>
  )
}