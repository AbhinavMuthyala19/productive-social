import { useEffect, useState } from "react";
import { Input } from "../ui/Input";
import AuthActionsRow from "./AuthActionsRow";
import { AuthLayout } from "./AuthLayout";
import { AuthLeftPanel } from "./AuthLeftPanel";
import { AuthLogo } from "./AuthLogo";
import { AuthRightPanel } from "./AuthRightPanel";
import { AuthTitle } from "./AuthTitle";
import loginHeader from "../../assets/loginheader.svg";
import { Button } from "../ui/Button";
import "./Auth.css";
import { Loader } from "lucide-react";

export const ForgotPasswordPage = ({
  email,
  onSubmit,
  onChange,
  authLoading,
}) => {
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);


  return (
    <AuthLayout
      left={<AuthLeftPanel imageSrc={loginHeader} />}
      right={
        <AuthRightPanel>
          <form onSubmit={onSubmit} className="auth-form">
            <AuthLogo />
            <AuthTitle title="Reset Password" />

            <Input
              name="email"
              className="auth-input"
              placeholder="Enter your email to receive link"
              type="text"
              value={email}
              onChange={onChange}
            />

            <AuthActionsRow>
              <Button
                type="submit"
                className="auth-button"
                disabled={authLoading || !email.trim()}
              >
                {authLoading ? (
                  <Loader className="spinner-icon" size={20} />
                ) : (
                  "Send link"
                )}
              </Button>
            </AuthActionsRow>

          </form>
        </AuthRightPanel>
      }
    />
  );
};
