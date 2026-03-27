import { Input } from "../ui/Input";
import AuthActionsRow from "./AuthActionsRow";
import { AuthLayout } from "./AuthLayout";
import { AuthLeftPanel } from "./AuthLeftPanel";
import { AuthLogo } from "./AuthLogo";
import { AuthRightPanel } from "./AuthRightPanel";
import { AuthTitle } from "./AuthTitle";
import { Button } from "../ui/Button";
import "./Auth.css";
import { Loader } from "lucide-react";

export const ResetPasswordPage = ({
  form,
  onSubmit,
  onChange,
  authLoading,
  passwordToggle,
  confirmPasswordToggle,
}) => {
  return (
    <AuthLayout
      left={<AuthLeftPanel />}
      right={
        <AuthRightPanel>
          <form onSubmit={onSubmit} className="auth-form">
            <AuthLogo />

            <AuthTitle title="Reset your password" />

            <Input
              name="password"
              className="auth-input"
              placeholder="New Password"
              type={passwordToggle.type}
              value={form.password}
              onChange={onChange}
              icon={passwordToggle.icon}
              onClick={passwordToggle.toggle}
            />
            <Input
              name="confirmPassword"
              className="auth-input"
              placeholder="Confirm new password"
              type={confirmPasswordToggle.type}
              value={form.confirmPassword}
              onChange={onChange}
              icon={confirmPasswordToggle.icon}
              onClick={confirmPasswordToggle.toggle}
            />

            <AuthActionsRow>
              <Button
                type="submit"
                className="auth-button"
                disabled={
                  authLoading || !form.password || !form.confirmPassword
                }
              >
                {authLoading ? (
                  <Loader className="spinner-icon" size={20} />
                ) : (
                  "Reset Password"
                )}
              </Button>
            </AuthActionsRow>
          </form>
        </AuthRightPanel>
      }
    />
  );
};
