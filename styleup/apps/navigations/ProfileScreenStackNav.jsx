import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "../screens/ProfileScreen";
import Settings from "../screens/Settings";
import EditProfile from "../screens/EditProfile";
import { useFonts, JosefinSans_400Regular, JosefinSans_700Bold } from '@expo-google-fonts/josefin-sans';

const Stack = createStackNavigator();

export default function ProfileScreenStackNav() {
    const [fontsLoaded] = useFonts({
        JosefinSans_400Regular,
        JosefinSans_700Bold,
    });
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="profile-tab"
                component={ProfileScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="settings"
                component={Settings}
                options={{
                    headerTitle: 'settings',
                    headerTitleStyle: {
                        fontFamily: 'JosefinSans_700Bold', // Using bold for headers
                        fontSize: 22,
                    },
                    headerBackTitle: ' ',  // Hides the text next to the back button
                }}
            />
            <Stack.Screen
                name="edit profile"
                component={EditProfile}
                options={{
                    headerTitle: 'edit profile',
                    headerTitleStyle: {
                        fontFamily: 'JosefinSans_700Bold', // Using bold for headers
                        fontSize: 22,
                    },
                    headerBackTitle: ' ',  // Hides the text next to the back button
                }}
            />
        </Stack.Navigator>
    );
}
