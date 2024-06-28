import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import UserCreationScreen from "../screens/Login/UserCreationScreen";
import WelcomeScreen from "../screens/Login/WelcomeScreen";

const Stack = createStackNavigator();

export default function WelcomeScreenStackNav() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="welcome"
                component={WelcomeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="user"
                component={UserCreationScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
