import { Home, UsersRound, UserRound } from "lucide-react";
import "./Navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export const Navbar = () => {
    const { logout } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout();
        navigate("/login")
    }
    return (
        <div className="sidebar">

            <div className="sidebar-logo">
                <h1>Procial</h1>
                <p>Sai Teja Chary</p>
            </div>

            <nav className="sidebar-nav">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? "nav-item active" : "nav-item"
                    }
                >
                    <Home size={18} /> Home
                </NavLink>

                <NavLink
                    to="/communities"
                    className={({ isActive }) =>
                        isActive ? "nav-item active" : "nav-item"
                    }
                >
                    <UsersRound size={18} /> Communities
                </NavLink>

                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        isActive ? "nav-item active" : "nav-item"
                    }
                >
                    <UserRound size={18} /> Profile
                </NavLink>
                
            </nav>

                <Button
                    variant="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </Button>

        </div>
    );
};
