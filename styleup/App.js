import { StatusBar } from "expo-status-bar";
import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
    AuthenticatedUserProvider,
    AuthenticatedUserContext,
} from "./apps/providers";
import { RootNavigator } from "./apps/navigations/RootNavigator";

export default function App() {
    return (
        <AuthenticatedUserProvider>
            <View style={styles.container}>
                <StatusBar style="light" />
                <RootNavigator />
            </View>
        </AuthenticatedUserProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
