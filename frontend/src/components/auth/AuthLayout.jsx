import "./Auth.css"

export const AuthLayout = ({left, right}) =>{
    return(
        <div className="auth-container">
            <div className="auth-left">{left}</div>
            <div className="aurh-right">{right}</div>
        </div>
    )
}