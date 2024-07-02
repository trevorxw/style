import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirebaseToken } from '../utils';

const useLikesData = (userId) => {
    const [likesData, setLikesData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch Likes Data
    const fetchLikesData = async () => {
        setLoading(true);
        const token = await getFirebaseToken();
        try {
            const response = await fetch(
                `https://fitpic-flask-ys4dqjogsq-wl.a.run.app/like/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            if (response.ok) {
                setLikesData(data);
                await AsyncStorage.setItem('likesData', JSON.stringify(data));
            } else {
                throw new Error('Failed to fetch likes data');
            }
        } catch (error) {
            console.error('Error fetching likes data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load cached data
    useEffect(() => {
        const loadCachedData = async () => {
            const cachedLikesData = await AsyncStorage.getItem('likesData');
            if (cachedLikesData) {
                setLikesData(JSON.parse(cachedLikesData));
            }
        };

        loadCachedData();
    }, []);

    // Refresh data
    useEffect(() => {
        fetchLikesData();
    }, [userId]);

    return { likesData, loading, refreshLikesData: fetchLikesData };
};

export default useLikesData;
