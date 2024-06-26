import { View, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import Like from "../components/HomeScreen/Like";
import ProfilePicture from "../components/HomeScreen/ProfilePicture";
import { useRoute } from "@react-navigation/native";
import Post from "../components/HomeScreen/Post";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function OtherPostScreen() {
    const route = useRoute();
    const { post } = route.params; // Receive post data directly from parameters

    if (!post) {
        return <Text>No post data available.</Text>;
    }

    console.log(post);

    return (
        <View style={styles.postContainer}>
            <Post card={post} />
        </View>
    );
}

const styles = StyleSheet.create({
    postContainer: {
        flex: 1,
    },
});
