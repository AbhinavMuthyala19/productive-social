import "./AuthLogo.css";
import authLogo from "../../assets/icons/authlogo.svg"

export const AuthLogo = () => {
  return (
    <div className="auth-logo">
      <img src={authLogo} alt="Procial logo" />
    </div>
  );
};
