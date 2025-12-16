import { createContext, useState, useEffect } from "react";
import { getProfile, loginUser, logoutUser, registerUser } from "../lib/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch user ONCE on first load
    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const res = await getProfile();
            setUser(res.data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (identifier, password) => {
        await loginUser(identifier, password);
        await fetchUser();
    };

    const register = async (data) => {
        await registerUser(data);
        await fetchUser();
    };

    const logout = async () => {
        await logoutUser();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
