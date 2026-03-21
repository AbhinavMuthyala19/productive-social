import "./Avatar.css";

export const Avatar = ({ src, alt = "", className }) => {
  return (
    <div
      className={`avatar ${className ?? ""}`}
      role="img"
      aria-label={alt}
    >
      {src ? <img src={`${import.meta.env.VITE_API_URL}/${src}`} alt={alt} /> : alt.charAt(0).toUpperCase()}
    </div>
  );
};

