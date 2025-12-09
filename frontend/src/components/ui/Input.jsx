import "./Input.css"


export const Input = ({
    type = "text",
    placeholder = "",
    value,
    onChange,
    variant = "default-input",
    ...rest
}) => {

    return (
        <input className = {`input ${variant}`}
        type = {type}
        placeholder = {placeholder}
        value={value}
        onChange = {onChange}
        {...rest}
        />
    )
}