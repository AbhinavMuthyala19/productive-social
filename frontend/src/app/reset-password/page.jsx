import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { usePasswordToggle } from "../../hooks/usePasswordToggle";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "sonner";
import { ResetPasswordPage } from "../../components/auth/ResetPasswordPage";
import { resetPassword } from "../../lib/api";

export const ResetPassword = () => {
  console.log("CURRENT PATH:", window.location.pathname);
  const navigate = useNavigate();
  const passwordToggle = usePasswordToggle();
  const confirmPasswordToggle = usePasswordToggle();
  const { user, loading } = useContext(AuthContext);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  console.log("RESET PASSWORD PAGE LOADED");
  console.log("TOKEN:", token);
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const from = location.state?.from || "/";

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or expired link");
      return;
    }

    if (!form.password || !form.confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setPasswordLoading(true);

      const res = await resetPassword(token, form.password);

      toast.success(res.data || "Password reset successful");

      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Reset Password failed, try again..",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) return null; // wait until AuthContext finishes

  return (
    <ResetPasswordPage
      form={form}
      onSubmit={handleResetPassword}
      onChange={handleChange}
      passwordToggle={passwordToggle}
      confirmPasswordToggle={confirmPasswordToggle}
      authLoading={passwordLoading}
    />
  );
};
