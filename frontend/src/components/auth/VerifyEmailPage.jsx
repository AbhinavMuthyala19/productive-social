import { useEffect, useState } from "react";
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

export const VerifyEmailPage = ({
  otp,
  onSubmit,
  onChange,
  onResend,
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

  const handleResend = () => {
    if (timer > 0) return;

    onResend();
    setTimer(60);
  };

  return (
    <AuthLayout
      left={<AuthLeftPanel />}
      right={
        <AuthRightPanel>
          <form onSubmit={onSubmit} className="auth-form">

            <AuthLogo />
            <AuthTitle title="Verify Email" />

            <Input
              name="otp"
              className="auth-input"
              placeholder="Enter OTP from email"
              type="text"
              value={otp}
              onChange={onChange}
            />

            <AuthActionsRow>
              <Button
                type="submit"
                className="auth-button"
                disabled={authLoading || !otp.trim()}
              >
                {authLoading ? (
                  <Loader className="spinner-icon" size={20} />
                ) : (
                  "Verify"
                )}
              </Button>
            </AuthActionsRow>

            {/* Timer + Resend */}
            <div className="otp-resend">
              {timer > 0 ? (
                <span>Resend OTP in {timer}s</span>
              ) : (
                <Button
                  type="button"
                  className="resend-btn"
                  onClick={handleResend}
                >
                  Resend OTP
                </Button>
              )}
            </div>

          </form>
        </AuthRightPanel>
      }
    />
  );
};