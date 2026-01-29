import "./Auth.css";

export const AuthLeftPanel = ({ imageSrc }) => {
  return (
    <div className="auth-left-panel">
      <img src={imageSrc} alt="Auth visual" />
    </div>
  );
};
