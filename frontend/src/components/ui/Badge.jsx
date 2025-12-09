import "./Badge.css";

export const Badge = ({ label, variant = "default-badge", icon }) => {
  return <span className={`badge ${variant}`}>
    {icon && <img src={icon} alt="icon" />}
    {label}
    </span>;
}
