import "./Card.css";

export const Card = ({
  children,
  variant = "default-card",
  className,
  ref,
  ...rest
}) => {
  return (
    <div ref={ref} className={`card ${variant} ${className ?? ""}`} {...rest}>
      {children}
    </div>
  );
};
