import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useMemo, useState } from "react";
import { usePasswordToggle } from "../../hooks/usePasswordToggle";
import { AuthContext } from "../../context/AuthContext";
import { LoginForm } from "../../components/auth/LoginForm";
import { toast } from "sonner";

export const Login = () => {
  const navigate = useNavigate();
  const { login, user, loading } = useContext(AuthContext);
  const passwordToggle = usePasswordToggle();
  const location = useLocation();
  const timezone = useMemo(
  () => Intl.DateTimeFormat().resolvedOptions().timeZone,
  []
);


  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const from = location.state?.from || "/";

  // 🔥 Automatic redirect when user becomes authenticated
  useEffect(() => {
    if (!loading && user) {
      navigate(from, { replace : true });
    }
  }, [user, loading, navigate, from]);

  if (loading) return null; // wait until AuthContext finishes

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(form.identifier, form.password, timezone);
    } catch (error) {
      toast.error("Incorrect email or password");
    }
  };
  return (
    <LoginForm
      form={form}
      onSubmit={handleLogin}
      onChange={handleChange}
      passwordToggle={passwordToggle}
    />
  );
};
