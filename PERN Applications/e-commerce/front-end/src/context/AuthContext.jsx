/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
// Step 1: Create the context object
const AuthContext = createContext(null);

// Step 2: Create the Provider component
export const AuthProvider = ({ children }) => {
    //local storage se initialize krege taki user logged in rhe refresh k bad bhi.
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem("token") || null;
    });

    // iisko call krege after the successful login API response
    const login = (userData, authToken) => {
        setUser(userData);
        console.log("user is stored in the global state and localstorage");
        console.log(user);
        setToken(authToken);
        console.log("Token is stored in the global state and loaclstorage");
        console.log(token);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", authToken);
    };

    // will be called after logout.
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user"); 
        localStorage.removeItem("token");
    };

    const value = {
        user,    // { id, name, email, role } or null
        token,
        login, // login k bad ye chlega
        logout, // logout ke time yeh chalega
        isLoggedIn: !!token, //true
    }
    // step 3:Create the Provider, Who Will Provide the Value Object
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// har jagah useContext(AuthContext nahi karna padega).
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
        //authProvider ke andar ke components ko hi access milega
    }
    return context; //{user,token,login,logout,isLoggedIn} ye sab dega
};