import "./TextArea.css"


export const TextArea = ({
  placeholder = "",
  value,
  onChange,
  variant = "default-textarea",
  rows = 4,
  ...rest
}) =>{
    return (
        <textarea 
            className={`textarea ${variant}`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            rows={rows}
            {...rest}
        >
        </textarea>
    )
}