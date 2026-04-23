import { createContext, useContext, useMemo, useState } from "react";
import { setApiToken } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        token: "",
        userId: "",
        username: "",
    });

    const login = (data) => {
        const nextAuth = {
            token: data.token || "",
            userId: String(data.userId || ""),
            username: data.username || "",
        };

        setAuth(nextAuth);
        setApiToken(nextAuth.token); // this lines stores token in the memory 
    };

    const logout = () => {
        setAuth({ token: "", userId: "", username: "" });
        setApiToken("");
    };

    const value = useMemo(() => ({
        auth,
        isLoggedIn: Boolean(auth.token),
        currentUserId: Number(auth.userId),
        login,
        logout,
    }), [auth]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider"); 
    }
    return context;
};
