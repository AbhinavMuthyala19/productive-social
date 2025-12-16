import "./Button.css"


export const Button = ({
    children,
    onClick,
    type = "button",
    variant = "default",
    className ="",
    disabled = false,
    style
}) =>{

    return (
       <button 
       className={`btn ${variant} ${className}`}
       onClick={onClick} 
       type={type}
       variant={variant}
       disabled={disabled}
       style={style}
       >
        {children}
       </button>
    )
    
}