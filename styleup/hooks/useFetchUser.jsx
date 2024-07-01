import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const useFetchUser = (userId) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUser = useCallback(async () => {
        if (!userId) {
            setError("No User ID provided");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        // First try to get the user data from AsyncStorage
        try {
            const storedUserData = await AsyncStorage.getItem(`userData_${userId}`);
            if (storedUserData) {
                setUser(JSON.parse(storedUserData));
                setLoading(false);
                return; // Exit early if data is found in storage
            }
        } catch (storageError) {
            console.error("Failed to fetch from storage", storageError);
            // Continue to fetch from network
        }
        // If not found in storage, fetch from the network
        try {
            const response = await axios.get(
                `https://fitpic-flask-ys4dqjogsq-wl.a.run.app/user/${userId}`
            );
            if (response.data && typeof response.data === "object") {
                setUser(response.data);
                // Save the new user data in AsyncStorage
                await AsyncStorage.setItem(`userData_${userId}`, JSON.stringify(response.data));
            } else {
                throw new Error("Received null or invalid user data");
            }
        } catch (error) {
            console.error("Failed to fetch user or process response", error);
            setError(error);
        } finally {
            setLoading(false);
        }
    }, [userId]); // useCallback to create a memoized function

    useEffect(() => {
        fetchUser();
    }, [fetchUser]); // Dependency array includes fetchUser to run effect when function changes

    return { user, loading, error, refreshUserData: fetchUser };
};

export default useFetchUser;
