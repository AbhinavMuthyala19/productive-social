import "./Button.css"


export const Button = ({
    children,
    onClick,
    type = "button",
    variant = "default",
    disabled = false
}) =>{

    return (
       <button 
       className={`btn ${variant}`}
       onClick={onClick} 
       type={type}
       variant={variant}
       disabled={disabled}
       >
        {children}
       </button>
    )
    
}