import "./Skeleton.css";

export const Skeleton = ({
  width = "100%",
  height,
  variant = "rect", // rect | text | circle
  style = {},
}) => {
  const getStyles = () => {
    switch (variant) {
      case "circle":
        return {
          width: width || height,
          height: height || width,
          borderRadius: "50%",
        };

      case "text":
        return {
          height: height || "12px",
          borderRadius: "6px",
        };

      default:
        return {
          height: height || "16px",
          borderRadius: "var(--radius-md)",
        };
    }
  };

  return (
    <div
      className="skeleton shimmer"
      aria-hidden="true"
      style={{
        width,
        ...getStyles(),
        ...style,
      }}
    />
  );
};