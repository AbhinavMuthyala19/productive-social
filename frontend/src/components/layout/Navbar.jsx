import { Home, UsersRound, UserRound, EllipsisVertical } from "lucide-react";
import "./Navbar.css";
import { Avatar } from "../ui/Avatar"
import { NavLink, useNavigate } from "react-router-dom";
import { Card } from "../ui/Card";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

export const Navbar = () => {
    const [profileOptionsClick, setProfileOptionsClick] = useState(false)
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
                <p>Chai peelo fraanss...</p>
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

            <div onClick={() => setProfileOptionsClick(!profileOptionsClick)} className="profile-card">
                <Avatar alt="Sai Teja Chary" size={50} />

                <div className="profile-details">
                    <p className="profile-name">Sai Teja Chary</p>
                    <p className="profile-user-name">@saitejachary</p>
                </div>

                <EllipsisVertical size={20} className="profile-more-icon" />

                <div className={`profile-options ${profileOptionsClick ? "open" : ""}`}>
                    <Card variant="options-card">
                        <p onClick={handleLogout}>Logout</p>
                    </Card>
                </div>


            </div>


        </div>
    );
};
