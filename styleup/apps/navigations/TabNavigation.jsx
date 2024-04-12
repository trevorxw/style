import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import NewsScreen from '../screens/NewsScreen';
import ProfileScreenStackNav from './ProfileScreenStackNav';
import PostScreenStackNav from './PostScreenStackNav';
import Posts from '../components/ProfileScreen/Posts';
import { Foundation, AntDesign, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import HomeScreenStackNav from './HomeScreenStackNav';

const Tab = createBottomTabNavigator();

// Icon component for reusability
const IconComponent = ({ name, library, color, size }) => {
    const Icon = library;
    return <Icon name={name} size={size} color={color} />;
};

export default function TabNavigation() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#000",
                lazy: true,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreenStackNav}
                options={{
                    tabBarLabel: ({ color }) => <Text style={{ color }}>Home</Text>,
                    tabBarIcon: ({ color, size }) => (
                        <IconComponent library={Foundation} name="home" color={color} size={size} />
                    ),
                    accessibilityLabel: "Home Tab",
                }}
            />
            {/* <Tab.Screen
                name="Explore"
                component={ExploreScreen}
                options={{
                    tabBarLabel: ({ color }) => <Text style={{ color }}>Explore</Text>,
                    tabBarIcon: ({ color, size }) => (
                        <IconComponent library={Foundation} name="magnifying-glass" color={color} size={size} />
                    ),
                    accessibilityLabel: "Explore Tab",
                }}
            /> */}
            <Tab.Screen
                name="AddPost"
                component={PostScreenStackNav}
                options={{
                    tabBarLabel: ({ color }) => <Text style={{ color }}>Post</Text>,
                    tabBarIcon: ({ color, size }) => (
                        <IconComponent library={AntDesign} name="skin" color={color} size={size} />
                    ),
                    accessibilityLabel: "Add Post Tab",
                }}
            />
            {/* <Tab.Screen
                name="News"
                component={Posts}
                options={{
                    tabBarLabel: ({ color }) => <Text style={{ color }}>News</Text>,
                    tabBarIcon: ({ color, size }) => (
                        <IconComponent library={MaterialIcons} name="newspaper" color={color} size={size + 2} />
                    ),
                    accessibilityLabel: "News Tab",
                }}
            /> */}
            <Tab.Screen
                name="Profile"
                component={ProfileScreenStackNav}
                options={{
                    tabBarLabel: ({ color }) => <Text style={{ color }}>Profile</Text>,
                    tabBarIcon: ({ color, size }) => (
                        <IconComponent library={FontAwesome5} name="user-alt" color={color} size={size - 1} />
                    ),
                    accessibilityLabel: "Profile Tab",
                }}
            />
        </Tab.Navigator>
    );
}
