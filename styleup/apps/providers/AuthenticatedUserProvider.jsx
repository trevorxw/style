import React, { useState, createContext } from "react";

export const AuthenticatedUserContext = createContext({});

export const AuthenticatedUserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (user) => {
        setUser(user);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthenticatedUserContext.Provider
            value={{ user, setUser, login, logout }}
        >
            {children}
        </AuthenticatedUserContext.Provider>
    );
};
