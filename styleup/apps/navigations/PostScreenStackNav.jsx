import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AddPostScreen from "../screens/Post/AddPostScreen";

const Stack = createStackNavigator();

export default function ProfileScreenStackNav() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="profile-tab"
                component={ProfileScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen name="settings" component={Settings} />
            <Stack.Screen name="edit-profile" component={EditProfile} />
        </Stack.Navigator>
    );
}
