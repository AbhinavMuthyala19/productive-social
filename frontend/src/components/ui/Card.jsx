import "./Card.css";

export const Card = ({ 
  children, 
  variant = "default-card", 
  ...rest 
}) => {
  return (
    <div className={`card ${variant}`} {...rest}>
      {children}
    </div>
  );
}
