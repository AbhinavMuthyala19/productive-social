import { Link } from "react-router-dom"
import "./AuthFooterSwitch.css"
 

export const AuthFooterSwitch = ({text, linkText, linkTo}) =>{
    return (
        <p className="auth-footer">
            {text}
            <Link to={linkTo}>{linkText}</Link>
        </p>
    )
}