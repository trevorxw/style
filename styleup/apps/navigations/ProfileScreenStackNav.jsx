import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import Settings from "../screens/Profile/Settings";
import EditProfile from "../screens/Profile/EditProfile";
import AddCollection from "../screens/Profile/AddCollection";
import ViewCollection from "../screens/Profile/ViewCollection";
import OotdCamera from "../screens/Profile/OotdCamera";
import OtherPostScreen from "../screens/OtherPostScreen";
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
            <Stack.Screen
                name="add collection"
                component={AddCollection}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="view collection"
                component={ViewCollection}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="ootdCamera"
                component={OotdCamera}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="post"
                component={OtherPostScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
