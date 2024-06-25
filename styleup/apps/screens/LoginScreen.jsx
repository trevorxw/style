import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import * as WebBrowser from "expo-web-browser";
import { useOAuth, useSession } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "../../hooks/useWarmUpBrowser";
import { Image } from 'expo-image';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    useWarmUpBrowser();

    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
    const { session } = useSession();


    const onPress = React.useCallback(async () => {
        try {
            const { createdSessionId, signIn, signUp, setActive } =
                await startOAuthFlow();
            if (createdSessionId) {
                console.log("Started New Session");
                setActive({ session: createdSessionId });
            } else {
                console.log("Here");
                // Use signIn or signUp for next steps such as MFA
            }
        } catch (err) {
            console.error("OAuth error", err);
        }
    }, []);

    return (
        <View>
            <Image
                source={require("./../../assets/images/online-fashion-shopping-collage.jpg")}
                className="w-full h-[400px] object-cover"
            />
            <View className="p-8 bg-white mt-[-20px] rounded-t-3xl shadow-md">
                <Text className="text-[30px] font-bold">Find</Text>
                <Text className="text-[18px] text-slate-500 mt-6">
                    Upgrade your style with your own tailored marketplace!
                </Text>
                <TouchableOpacity
                    onPress={onPress}
                    className="p-4 bg-blue-500 rounded-full mt-20"
                >
                    <Text className="text-white text-center text-[18px]">
                        Get Started
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
