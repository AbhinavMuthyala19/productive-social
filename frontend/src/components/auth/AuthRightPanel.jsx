import "./Auth.css";

export const AuthRightPanel = ({imageSrc}) => {
  return (
    <div className="auth-right-panel">
      {<img src={imageSrc} alt="Auth visual" />}
    </div>
  );
};
