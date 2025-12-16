import AuthActionsRow from "../../components/auth/AuthActionsRow"
import { AuthFooterSwitch } from "../../components/auth/AuthFooterSwitch"
import { AuthLayout } from "../../components/auth/AuthLayout"
import { AuthLeftPanel } from "../../components/auth/AuthLeftPanel"
import { AuthLogo } from "../../components/auth/AuthLogo"
import { AuthRightPanel } from "../../components/auth/AuthRightPanel"
import { AuthTitle } from "../../components/auth/AuthTitle"
import { GoogleSignButton } from "../../components/auth/GoogleSignButton"
import { OrDivider } from "../../components/auth/OrDivider"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import loginHeader from "../../assets/loginheader.svg"
import { useContext, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { usePasswordToggle } from "../../hooks/usePasswordToggle"
import { AuthContext } from "../../context/AuthContext"


export const Register = () => {

    const navigate = useNavigate()
    const passwordToggle = usePasswordToggle()
    const confirmPasswordToggle = usePasswordToggle()
    const { register, user, loading } = useContext(AuthContext)
    const location = useLocation();

    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const from = location.state?.from || "/";

    // 🔥 Automatic redirect when user becomes authenticated
    useEffect(() => {
        if (!loading && user) {
            navigate(from, { replace: true });
        }
    }, [user, loading]);

    if (loading) return null;  // wait until AuthContext finishes

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

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
                password: form.password
            }

            await register(body);
            alert("Registration Successful!")
            navigate("/login")
        } catch (error) {
            console.error("REGISTER ERROR:", err.response?.data);
            alert("Registration failed.");
        }
    };

    return (
        <AuthLayout
            left={
                <AuthLeftPanel
                    imageSrc={loginHeader}
                />
            }
            right={
                <AuthRightPanel>
                    <form onSubmit={handleRegister} className="auth-form">

                        <AuthLogo />

                        <AuthTitle title="Register" />

                        <GoogleSignButton />

                        <OrDivider />

                        <Input
                            name="name"
                            variant="login-input"
                            placeholder="Name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                        />

                        <Input
                            name="username"
                            variant="login-input"
                            placeholder="Username"
                            type="text"
                            value={form.username}
                            onChange={handleChange}
                        />

                        <Input
                            name="email"
                            variant="login-input"
                            placeholder="Email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                        />

                        <Input
                            name="password"
                            variant="login-input"
                            placeholder="Password"
                            type={passwordToggle.type}
                            value={form.password}
                            onChange={handleChange}
                            icon={passwordToggle.icon}
                            onClick={passwordToggle.toggle}
                        />
                        <Input
                            name="confirmPassword"
                            variant="login-input"
                            placeholder="Confirm password"
                            type={confirmPasswordToggle.type}
                            value={form.confirmPassword}
                            onChange={handleChange}
                            icon={confirmPasswordToggle.icon}
                            onClick={confirmPasswordToggle.toggle}
                        />

                        <AuthActionsRow>
                            <Button type="submit" variant="login-button">Sign up</Button>
                        </AuthActionsRow>

                        <AuthFooterSwitch
                            text="Already have an account?"
                            linkText="Sign in"
                            linkTo="/login" />
                    </form>
                </AuthRightPanel>
            }

        />
    )
}