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
import { Button } from "../ui/Button";
import "./Auth.css";
import { Loader } from "lucide-react";

export const LoginPage = ({
  form,
  onSubmit,
  onChange,
  authLoading,
  passwordToggle,
}) => {
  return (
    <AuthLayout
      left={<AuthLeftPanel/>}
      right={
        <AuthRightPanel>
          <form onSubmit={onSubmit} className="auth-form">
            <AuthLogo />

            <AuthTitle title="Login" />

            <GoogleSignButton />

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
              <Link to="/forgot-password">Forgot password</Link>
            </p>

            <AuthActionsRow>
              <Button
                type="submit"
                className="auth-button"
                disabled={authLoading}
              >
                {authLoading ? (
                  <Loader className="spinner-icon" size={20} />
                ) : (
                  "Sign in"
                )}
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
