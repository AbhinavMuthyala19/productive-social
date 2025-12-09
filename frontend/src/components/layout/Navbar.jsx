import { Home, UsersRound, UserRound } from "lucide-react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";

export const Navbar = () => {
    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <h1>Procial</h1>
                <p>Tagline - chai peelo</p>
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
        </div>
    );
};
