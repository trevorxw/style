import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import OtherProfileScreen from "../screens/OtherProfileScreen";
import HomeScreen from "../screens/HomeScreen";
import OtherPostScreen from "../screens/OtherPostScreen";

const Stack = createStackNavigator();

export default function HomeScreenStackNav() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="home"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="profile"
                component={OtherProfileScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="post"
                component={OtherPostScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
