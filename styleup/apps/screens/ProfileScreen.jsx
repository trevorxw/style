import {
    View,
    Text,
    Image,
    TouchableOpacity,
    useWindowDimensions,
} from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { Feather } from "@expo/vector-icons";
import Followers from "../components/ProfileScreen/Followers";
import Following from "../components/ProfileScreen/Following";
import { TabView, SceneMap } from "react-native-tab-view";
import { FlatGrid } from "react-native-super-grid";

const FirstRoute = () => (
    <View style={{ flex: 1, backgroundColor: "#ff4081" }} />
);

const SecondRoute = () => (
    <View style={{ flex: 1, backgroundColor: "#673ab7" }} />
);

const ThirdRoute = () => (
  <View style={{ flex: 1, backgroundColor: "#673ab7" }} />
);

const FourthRoute = () => (
  <View style={{ flex: 1, backgroundColor: "#673ab7" }} />
);

const renderScene = SceneMap({
    posts: FirstRoute,
    swipes: SecondRoute,
    saved: ThirdRoute,
    wardrobe: FourthRoute,
});

export default function ProfileScreen() {
    const { user } = useUser();

    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: "posts", title: "Posts" },
        { key: "swipes", title: "Swipes" },
        { key: "saved", title: "Saved" },
        { key: "wardrobe", title: "Wardrobe" },
    ]);

    return (
        <View>
            <View className="mt-14 ml-6 flex-row ">
                <Image
                    source={{ uri: user.imageUrl }}
                    className="w-[120px] h-[120px] rounded-full justify-center"
                />
                {/* Text View */}
                <View className="w-3/5">
                    <View className="right-1 absolute">
                        <TouchableOpacity>
                            <Feather name="settings" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <View className="ml-5">
                        <Text className="mt-8 font-bold text-[25px]">
                            @{user.fullName}
                        </Text>
                        <Text className="ml-4 mt-1 text-[20px]">
                            trevor | 😃😃😃😃
                        </Text>
                        <View className="flex-row mt-3">
                            <Text className="font-bold text-[20px]">INS:</Text>
                            <Text className="text-[20px]">
                                currently obsessed with...
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            <View className="mt-5 flex-row">
                <View className="justify-center">
                    <TouchableOpacity className="ml-6 border-2 w-28 rounded-sm py-1">
                        <Text className="text-[20px] text-center">
                            edit profile
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Followers and Following */}
                <View className="w-3/5 justify-center flex-row">
                    <Followers className="" />
                    <Following className="" />
                </View>
            </View>
            <View className="h-full mt-3">
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{ width: layout.width }}
                />
            </View>
        </View>
    );
}
