import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type UserResponse = {
    id: number;
    email: string;
    userType: "coach" | "athlete";
    userPhoto?: string | null;
    name?: string | null;
};

type AuthState = {
    user: UserResponse | null;
    token: string | null;
};

interface UserContextType {
    user: UserResponse | null;
    token: string | null;
    setAuth: (user: UserResponse, token: string) => void;
    setUser: (user: UserResponse | null) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = "auth";

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [auth, setAuthState] = useState<AuthState>(() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { user: null, token: null };
        try {
            return JSON.parse(raw) as AuthState;
        } catch {
            return { user: null, token: null };
        }
    });

    const setAuth = (user: UserResponse, token: string) => {
        const next = { user, token };
        setAuthState(next);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    };

    const setUser = (user: UserResponse | null) => {
        const next = { user, token: auth.token };
        setAuthState(next);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    };

    const logout = () => {
        setAuthState({ user: null, token: null });
        localStorage.removeItem(STORAGE_KEY);
    };

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    }, [auth]);

    return (
        <UserContext.Provider value={{ user: auth.user, token: auth.token, setAuth, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUserContext must be used within a UserProvider");
    return ctx;
};

export const getToken = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as AuthState;
        return parsed.token ?? null;
    } catch {
        return null;
    }
};
