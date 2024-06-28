import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/Login/LoginScreen";
import OptionsScreen from "../screens/Login/OptionsScreen";
import RegistrationScreen from "../screens/Login/RegistrationScreen";

const Stack = createStackNavigator();

export default function LoginScreenStackNav() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="options"
                component={OptionsScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="login"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="registration"
                component={RegistrationScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
