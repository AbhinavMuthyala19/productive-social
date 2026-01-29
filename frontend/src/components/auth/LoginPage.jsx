import { Link } from "react-router-dom";
import { Input } from "../ui/Input";
import AuthActionsRow from "./AuthActionsRow";
import { AuthLayout } from "./AuthLayout";
import { AuthLeftPanel } from "./AuthLeftPanel";
import { AuthLogo } from "./AuthLogo";
import { AuthRightPanel } from "./AuthRightPanel";
import { AuthTitle } from "./AuthTitle";
import { GoogleSignButton } from "./GoogleSignButton";
import { OrDivider } from "./OrDivider";
import { AuthFooterSwitch } from "./AuthFooterSwitch";
import loginHeader from "../../assets/loginheader.svg";
import { Button } from "../ui/Button";
import "./Auth.css";

export const LoginPage = ({ form, onSubmit, onChange, passwordToggle }) => {
  return (
    <AuthLayout
      left={<AuthLeftPanel imageSrc={loginHeader} />}
      right={
        <AuthRightPanel>
          <form onSubmit={onSubmit} className="auth-form">
            <AuthLogo />

            <AuthTitle title="Login" />

            <GoogleSignButton isLogin={true} />

            <OrDivider />

            <Input
              name="identifier"
              className="auth-input"
              placeholder="Email or username"
              type="text"
              value={form.identifier}
              onChange={onChange}
            />

            <Input
              name="password"
              className="auth-input"
              placeholder="Password"
              type={passwordToggle.type}
              icon={passwordToggle.icon}
              onClick={passwordToggle.toggle}
              value={form.password}
              onChange={onChange}
            />

            <p className="forgot-password">
              <Link to="/forgotpassword">Forgot password</Link>
            </p>

            <AuthActionsRow>
              <Button type="submit" className="auth-button">
                Login
              </Button>
            </AuthActionsRow>

            <AuthFooterSwitch
              text="Don't have an account?"
              linkText="Sign up"
              linkTo="/register"
            />
          </form>
        </AuthRightPanel>
      }
    />
  );
};
