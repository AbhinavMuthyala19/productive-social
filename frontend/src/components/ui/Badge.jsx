import "./Badge.css";

export const Badge = ({ label, variant = "default-badge", icon }) => {
  return <span className={`badge ${variant}`}>
    {typeof icon === "string" ? (
      <img src={icon} alt="icon" className="icon" />
    ) : (
      icon
    )}

    {label}
  </span>;
}
