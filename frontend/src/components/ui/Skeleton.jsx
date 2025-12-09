import "./Skeleton.css";

export const Skeleton = ({ width = "100%", height = "16px", circle = false }) => {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        borderRadius: circle ? "50%" : "var(--radius-md)"
      }}
    />
  );
}
