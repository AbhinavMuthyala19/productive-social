import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePasswordToggle } from "../../hooks/usePasswordToggle";
import { AuthContext } from "../../context/AuthContext";
import { RegisterForm } from "../../components/auth/RegisterForm";
import { toast } from "sonner";

export const Register = () => {
  const navigate = useNavigate();
  const passwordToggle = usePasswordToggle();
  const confirmPasswordToggle = usePasswordToggle();
  const { register, user, loading } = useContext(AuthContext);
  const location = useLocation();
  const timezone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    [],
  );

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const from = location.state?.from || "/";

  // 🔥 Automatic redirect when user becomes authenticated
  useEffect(() => {
    if (!loading && user) {
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);

  if (loading) return null; // wait until AuthContext finishes

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const body = {
        name: form.name,
        username: form.username,
        email: form.email,
        password: form.password,
        timezone,
      };

      await register(body);
      toast.success("Registration successful!");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("REGISTER ERROR:", error.response?.data);
      toast.error(error.response?.data?.message || "Registration failed...");
    }
  };

  return (
    <RegisterForm
      form={form}
      onSubmit={handleRegister}
      onChange={handleChange}
      passwordToggle={passwordToggle}
      confirmPasswordToggle={confirmPasswordToggle}
    />
  );
};
