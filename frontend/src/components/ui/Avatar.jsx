import "./Avatar.css";

export const Avatar = ({ src, alt = "", className }) => {
  return (
    <div
      className={`avatar ${className ?? ""}`}
      role="img"
      aria-label={alt}
    >
      {src ? <img src={src} alt={alt} /> : alt.charAt(0).toUpperCase()}
    </div>
  );
};

