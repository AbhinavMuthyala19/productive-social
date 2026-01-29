import { Home, UsersRound, UserRound, EllipsisVertical } from "lucide-react";
import "./Navbar.css";
import { Avatar } from "../ui/Avatar";
import { NavLink, useNavigate } from "react-router-dom";
import { Card } from "../ui/Card";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

export const Navbar = () => {
  const cardRef = useRef();
  const [profileOptionsClick, setProfileOptionsClick] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setProfileOptionsClick(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="sidebar">
      <div className="sidebar-logo" onClick={() => navigate("/")}>
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

      <div
        ref={cardRef}
        className="profile-card"
        onClick={(e) => {
          e.stopPropagation();
          setProfileOptionsClick((v) => !v);
        }}
      >
        <Avatar alt={user.name} size={50} />

        <div className="profile-details">
          <p className="profile-name">{user.name}</p>
          <p className="profile-user-name">{`@${user.username}`}</p>
        </div>

        <EllipsisVertical size={20} className="profile-more-icon" />

        <div className={`profile-options ${profileOptionsClick ? "open" : ""}`}>
          <Card variant="options-card">
            <p
              onClick={(e) => {
                e.stopPropagation();
                handleLogout();
              }}
            >
              Logout
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
