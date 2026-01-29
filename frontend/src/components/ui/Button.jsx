import "./Button.css";

export const Button = ({
  children,
  onClick,
  type = "button",
  variant,
  className,
  disabled = false,
  style,
  ...rest
}) => {
  return (
    <button
      className={`btn ${variant ?? ""} ${className ?? ""}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      style={style}
      {...rest}
    >
      {children}
    </button>
  );
};
