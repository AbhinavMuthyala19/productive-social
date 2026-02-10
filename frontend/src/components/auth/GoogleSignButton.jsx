import { Button } from "../../components/ui/Button";
import googleIcon from "../../assets/icons/googleiconsvg.svg"
import "./GoogleSignButton.css";
import "./Auth.css"

export const GoogleSignButton = ({ isLogin }) => {
  return (
    <div className="button-container">
      <Button className="sso-button">
        <img src={googleIcon} alt="Google icon" />
        {isLogin ? "Sign in with Google" : "Sign up with Google"}
      </Button>
    </div>
  );
};
