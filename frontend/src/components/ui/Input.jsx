import "./Input.css"


export const Input = ({
    type = "text",
    placeholder = "",
    value,
    onChange,
    onClick,
    variant = "default-input",
    icon = "",
    ...rest
}) => {

    return (
        <div className="input-wrapper">

            <input className={`input ${variant}`}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                {...rest}
            />
            {icon && <img className="input-icon" onClick={onClick} src={icon} alt="toggle-icon" />}
        </div>
    )
}