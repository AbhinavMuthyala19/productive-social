import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "sonner";
import { VerifyEmailPage } from "../../components/auth/VerifyEmailPage";

export const VerifyEmail = () => {
  const navigate = useNavigate();
  const { verify, resendOtp, user, loading, authLoading } = useContext(AuthContext);
  const location = useLocation();

  const [otp, setOtp] = useState("");

  const email = location.state?.email;

  const from = location.state?.from || "/";

  useEffect(() => {
    if (!loading && user) {
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);

  if (loading) return null;

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      toast.error("Please enter OTP");
      return;
    }

    try {
      await verify({ email, otp });

      toast.success("Email Verified ✅");
      navigate("/login", { replace: true });
    } catch {
      toast.error("Verification failed, try again...");
    } finally{
      setOtp("")
    }
  };

  const handleResend = async () => {
  try {
    await resendOtp(email);
    toast.success("OTP sent again");
  } catch {
    toast.error("Failed to resend OTP");
  }
};

  return (
    <VerifyEmailPage
      otp={otp}
      onSubmit={handleVerify}
      onChange={handleChange}
      authLoading={authLoading}
      onResend={handleResend}
    />
  );
};
