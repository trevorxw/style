import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/Login/LoginScreen";
import OptionsScreen from "../screens/Login/OptionsScreen";
import RegistrationScreen from "../screens/Login/RegistrationScreen";
import UserCreationScreen from "../screens/Login/UserCreationScreen";
import WelcomeScreen from "../screens/Login/WelcomeScreen";

const Stack = createStackNavigator();

export default function LoginScreenStackNav() {
    return (
        <Stack.Navigator>
            {/* <Stack.Screen
                name="options"
                component={OptionsScreen}
                options={{ headerShown: false }}
            /> */}
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
