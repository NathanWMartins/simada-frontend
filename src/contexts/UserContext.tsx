import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type UserResponse = {
    id: number;
    email: string;
    userType: 'coach' | 'athlete';
    userPhoto?: string | null;
    name?: string | null;
};

interface UserContextType {
    user: UserResponse | null;
    setUser: (user: UserResponse | null) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserResponse | null>(() => {
        const raw = localStorage.getItem("user");
        return raw ? (JSON.parse(raw) as UserResponse) : null;
    });

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
};
