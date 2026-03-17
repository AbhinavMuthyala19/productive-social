import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "sonner";
import { ForgotPasswordPage } from "../../components/auth/ForgotPasswordPage";
import { forgotPassword } from "../../lib/api";

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [resetLinkLoading, setResetLinkLoading] = useState(false);

  const from = location.state?.from || "/";

  useEffect(() => {
    if (!loading && user) {
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);

  if (loading) return null;

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleResetLink = async (e) => {
    e.preventDefault();

    try {
      setResetLinkLoading(true);
      const res = await forgotPassword({ email });
      toast.success(res.data);

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Reset password request failed, try again...",
      );
    } finally {
      setResetLinkLoading(false);
      setEmail("");
    }
  };

  return (
    <ForgotPasswordPage
      email={email}
      onSubmit={handleResetLink}
      onChange={handleChange}
      authLoading={resetLinkLoading}
    />
  );
};
