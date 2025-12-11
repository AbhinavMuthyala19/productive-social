import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { Navigate, Outlet, useLocation } from "react-router-dom";



export const ProtectedRoute = () => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) return null;

    if (!user) {
        return <Navigate
            to="/login"
            replace
            state={{ from: location }}
        />
    }

    return <Outlet />
}