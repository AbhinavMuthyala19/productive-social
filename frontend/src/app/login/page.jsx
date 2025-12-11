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
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { usePasswordToggle } from "../../hooks/usePasswordToggle"
import { AuthContext } from "../../context/AuthContext"

export const Login = () => {

    const navigate = useNavigate();
    const {login, user, loading} = useContext(AuthContext);
    const passwordToggle = usePasswordToggle();
    const location = useLocation();
    
    const [form, setForm] = useState({
        identifier:"",
        password:""
    })
    
    const from = location.state?.from || "/";

    // 🔥 Automatic redirect when user becomes authenticated
    useEffect(() => {
        if (!loading && user) {
            navigate(from, { replace: true });
        }
    }, [user, loading]);

    if (loading) return null;  // wait until AuthContext finishes

    const handleChange = (e) =>{
        setForm({ ...form, [e.target.name]: e.target.value})
    }

    const handleLogin = async (e) =>{
        e.preventDefault()
        console.log(form)

        try {
            await login(form.identifier, form.password);
            alert("Login successful!")
        } catch (error) {
            alert("Incorrect email or password")
            
        }
    }
    return (
        <AuthLayout
            left={
                <AuthLeftPanel>
                    <form onSubmit={handleLogin} className="auth-form">
                        <AuthLogo />

                        <AuthTitle title="Login" />

                        <GoogleSignButton type={"login"} />

                        <OrDivider />

                        <Input 
                        name="identifier"
                        variant="login-input" 
                        placeholder="Email or username" 
                        type="text"
                        value={form.identifier}
                        onChange={handleChange} 
                        />

                        <Input 
                        name="password"
                        variant="login-input" 
                        placeholder="Password" 
                        type={passwordToggle.type}
                        icon={passwordToggle.icon}
                        onClick={passwordToggle.toggle}
                        value={form.password}
                        onChange={handleChange} 
                        />

                        <p className="forgot-password">
                            <Link to="/forgotpassword">Forgot password</Link>
                        </p>

                        <AuthActionsRow>
                            <Button type="submit" variant="login-button">Login</Button>
                        </AuthActionsRow>

                        <AuthFooterSwitch
                            text="Don't have an account?"
                            linkText="Sign up"
                            linkTo="/register" />
                    </form>
                </AuthLeftPanel >
            }
            right={
                < AuthRightPanel
                    imageSrc={loginHeader}
                />
            }
        />
    )
}