import "./Avatar.css";

export const Avatar = ({ src, alt = "", size = 40 }) => {
  return (
    <div
      className="avatar"
      style={{ width: size, height: size, fontSize: size / 2.5 }}
    >
      {src ? <img src={src} alt={alt} /> : alt.charAt(0).toUpperCase()}
    </div>
  );
}
