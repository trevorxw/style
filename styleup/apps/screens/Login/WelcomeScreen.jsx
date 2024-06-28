import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity  } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function WelcomeScreen() {
    // Create an opacity state using Animated API
    const fadeAnim = useRef(new Animated.Value(0)).current;  // Initial value for opacity: 0
    const navigation = useNavigation();

    useEffect(() => {
        // Use Animated.timing to gradually change the opacity to 1
        Animated.timing(
            fadeAnim,
            {
                toValue: 1,
                duration: 2000,  // Duration of the fade in milliseconds
                useNativeDriver: true  // Use native driver for better performance
            }
        ).start();
    }, [fadeAnim]);

    const handleNextPress = () => {
        navigation.navigate('user');
    };

    return (
        <View style={styles.container}>
            <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
                welcome to fitpic
            </Animated.Text>
            <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
                We'll begin by setting up your profile!
            </Animated.Text>
            <Animated.View style={{ opacity: fadeAnim, position: 'absolute', right: 20, bottom: 20 }}>
                <TouchableOpacity onPress={handleNextPress}>
                    <Text style={styles.nextText}>next</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',  // Assuming a white background
    },
    title: {
        fontSize: 60,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#45B0FF',  // Assuming a blue color for the text
        fontFamily: "JosefinSans_700Bold",
    },
    subtitle: {
        fontSize: 18,
        color: 'black',
        marginTop: 10,
        fontFamily: "JosefinSans_400Regular",
    },
    nextText: {
        position: 'absolute',
        right: 20,
        bottom: 50,
        fontSize: 30,
        color: '#45B0FF',
        fontFamily: "JosefinSans_400Regular",
    }
});
