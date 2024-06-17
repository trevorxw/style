import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchUser = (userId) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (!userId) {
                setError("No User ID provided");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(`https://3cc7-2600-1700-3680-2110-c494-b15d-2488-7b57.ngrok-free.app/user/${userId}`);
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
        };

        fetchUser();
    }, [userId]); // Dependency array ensures the effect runs only when userId changes

    return { user, loading, error };
};

export default useFetchUser;
