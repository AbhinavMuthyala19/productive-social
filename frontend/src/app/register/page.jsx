import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePasswordToggle } from "../../hooks/usePasswordToggle";
import { AuthContext } from "../../context/AuthContext";
import { RegisterForm } from "../../components/auth/RegisterForm";

export const Register = () => {
  const navigate = useNavigate();
  const passwordToggle = usePasswordToggle();
  const confirmPasswordToggle = usePasswordToggle();
  const { register, user, loading } = useContext(AuthContext);
  const location = useLocation();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

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
  }, [user, loading]);

  if (loading) return null; // wait until AuthContext finishes

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const body = {
        name: form.name,
        username: form.username,
        email: form.email,
        password: form.password,
        timezone
      };

      await register(body);
      alert("Registration Successful!");
      navigate("/login");
    } catch (error) {
      console.error("REGISTER ERROR:", err.response?.data);
      alert("Registration failed.");
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
