import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";

const Stack = createStackNavigator();

export default function LoginScreenStackNav() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="login"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
            {/* <Stack.Screen
                name="profile"
                component={OtherProfileScreen}
                options={{ headerShown: false }}
            /> */}
        </Stack.Navigator>
    );
}
