import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AddPostScreen from "../screens/Post/AddPostScreen";

const Stack = createStackNavigator();

export default function PostScreenStackNav() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="post1"
                component={AddPostScreen}
                options={{ headerShown: false }}
            />
            {/* <Stack.Screen name="post1" component={AddPostScreen} /> */}
            {/* <Stack.Screen name="post2" component={EditProfile} /> */}
        </Stack.Navigator>
    );
}
