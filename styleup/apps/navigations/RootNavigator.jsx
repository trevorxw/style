import React, { useState, useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";

import { AuthenticatedUserContext } from "../providers";
import { auth } from "../../firebaseConfig";
import LoginScreenStackNav from "./LoginScreenStackNav";
import TabNavigation from "./TabNavigation";
import WelcomeScreenStackNav from "./WelcomeScreenStackNav";
import useFetchUser from "../../hooks/useFetchUser";

export const RootNavigator = () => {
    const [isLoading, setIsLoading] = useState(true);

    const { user, setUser } = useContext(
        AuthenticatedUserContext
    );

    useEffect(() => {
        // onAuthStateChanged returns an unsubscriber
        const unsubscribeAuthStateChanged = onAuthStateChanged(
            auth,
            (authenticatedUser) => {
                authenticatedUser ? setUser(authenticatedUser) : setUser(null);
                setIsLoading(false);
            }
        );
        // unsubscribe auth listener on unmount
        return unsubscribeAuthStateChanged;
    }, [user]);

    return (
        <NavigationContainer>
            {user && user.displayName? (
                <TabNavigation />
            ) : user ? (
                <WelcomeScreenStackNav/>
            ) : (
                <LoginScreenStackNav />
            )}
        </NavigationContainer>
    );
};
