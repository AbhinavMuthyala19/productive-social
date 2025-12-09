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
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { loginUser } from "../../lib/api"

export const Login = () => {

    const navigate = useNavigate()

    const [form, setForm] = useState({
        identifier:"",
        password:""
    })

    const handleChange = (e) =>{
        setForm({ ...form, [e.target.name]: e.target.value})
    }

    const handleLogin = async (e) =>{
        e.preventDefault()
        console.log(form)

        try {
            const res = await loginUser(form.identifier, form.password);
            console.log("Logged in:", res.data)
            alert("Login successful!")
            navigate("/")
        } catch (error) {
            console.error("Login error: ", error.response?.data)
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
                        value={form.identifer}
                        onChange={handleChange} 
                        />

                        <Input 
                        name="password"
                        variant="login-input" 
                        placeholder="Password" 
                        type="password"
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