import { Input } from "../ui/Input";
import { AuthFooterSwitch } from "./AuthFooterSwitch";
import { AuthLayout } from "./AuthLayout";
import { AuthLeftPanel } from "./AuthLeftPanel";
import { AuthLogo } from "./AuthLogo";
import { AuthRightPanel } from "./AuthRightPanel";
import { AuthTitle } from "./AuthTitle";
import { GoogleSignButton } from "./GoogleSignButton";
import { OrDivider } from "./OrDivider";
import loginHeader from "../../assets/loginheader.svg";
import AuthActionsRow from "./AuthActionsRow";
import { Button } from "../ui/Button";
import "./Auth.css";

export const RegisterPage = ({
  form,
  onSubmit,
  onChange,
  passwordToggle,
  confirmPasswordToggle,
}) => {
  return (
    <AuthLayout
      left={<AuthLeftPanel imageSrc={loginHeader} />}
      right={
        <AuthRightPanel>
          <form onSubmit={onSubmit} className="auth-form">
            <AuthLogo />

            <AuthTitle title="Register" />

            <GoogleSignButton isLogin={false}/>

            <OrDivider />

            <Input
              name="name"
              className="auth-input"
              placeholder="Name"
              type="text"
              value={form.name}
              onChange={onChange}
            />

            <Input
              name="username"
              className="auth-input"
              placeholder="Username"
              type="text"
              value={form.username}
              onChange={onChange}
            />

            <Input
              name="email"
              className="auth-input"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={onChange}
            />

            <Input
              name="password"
              className="auth-input"
              placeholder="Password"
              type={passwordToggle.type}
              value={form.password}
              onChange={onChange}
              icon={passwordToggle.icon}
              onClick={passwordToggle.toggle}
            />
            <Input
              name="confirmPassword"
              className="auth-input"
              placeholder="Confirm password"
              type={confirmPasswordToggle.type}
              value={form.confirmPassword}
              onChange={onChange}
              icon={confirmPasswordToggle.icon}
              onClick={confirmPasswordToggle.toggle}
            />

            <AuthActionsRow>
              <Button type="submit" className="auth-button">
                Sign up
              </Button>
            </AuthActionsRow>

            <AuthFooterSwitch
              text="Already have an account?"
              linkText="Sign in"
              linkTo="/login"
            />
          </form>
        </AuthRightPanel>
      }
    />
  );
};
