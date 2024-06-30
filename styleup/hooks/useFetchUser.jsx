import { useState, useEffect, useCallback } from "react";
import axios from "axios";

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

        try {
            const response = await axios.get(
                `https://1c3f-2600-1700-3680-2110-c5e1-68dc-a20a-4910.ngrok-free.app/user/${userId}`
            );
            if (response.data && typeof response.data === "object") {
                setUser(response.data);
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
