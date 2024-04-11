import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import NewsScreen from '../screens/NewsScreen';
import { Foundation, AntDesign, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import ProfileScreenStackNav from './ProfileScreenStackNav';
import PostScreenStackNav from './PostScreenStackNav';
import Posts from '../components/ProfileScreen/Posts';

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator screenOptions={{
        headerShown:false,
        // tabBarActiveTintColor:"#000"
        }}>
      <Tab.Screen name="Home" component={HomeScreen} 
        options={{
            tabBarLabel:({color})=>(
                <Text style={{color:color}}>Home</Text>
            ),
            tabBarIcon:({color,size})=>(
                <Foundation name="home" size={size} color={color} />
            )
        }}
      />
      <Tab.Screen name="Explore" component={ExploreScreen}
        options={{
            tabBarLabel:({color})=>(
                <Text style={{color:color}}>Explore</Text>
            ),
            tabBarIcon:({color,size})=>(
                <Foundation name="magnifying-glass" size={size} color={color} />
            )
        }}
      />
      <Tab.Screen name="AddPost" component={PostScreenStackNav}
        options={{
            tabBarLabel:({color})=>(
                <Text style={{color:color}}>Post</Text>
            ),
            tabBarIcon:({color,size})=>(
                <AntDesign name="skin" size={size} color={color} />
            )
        }}
      />
      <Tab.Screen name="News" component={Posts}
        options={{
            tabBarLabel:({color})=>(
                <Text style={{color:color}}>News</Text>
            ),
            tabBarIcon:({color,size})=>(
                <MaterialIcons name="newspaper" size={size+2} color={color} />
            )
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreenStackNav}
        options={{
            tabBarLabel:({color})=>(
                <Text style={{color:color}}>Profile</Text>
            ),
            tabBarIcon:({color,size})=>(
                <FontAwesome5 name="user-alt" size={size-1} color={color} />
            )
        }}
      />
    </Tab.Navigator>
  )
}