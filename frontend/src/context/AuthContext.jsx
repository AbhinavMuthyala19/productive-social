import { createContext, useState } from "react";


export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    const login = async (identifier, password) => {
        await loginUser(identifier, password);
        await fetchUser();
    }

    const register = async (data) =>{
        await registerUser(data);
        await fetchUser();
    }

    const fetchUser = async () =>{
        try {
            const res = await getProfile();
            setUser(res.data)
        } catch (error) {
            setUser(null)
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{user, login, register}}>
            {children}
        </AuthContext.Provider>
    )
}