import "./Checkbox.css"


export const Checkbox = ({ completed, onChange, label }) => {
  return (
    <label className="checkbox-container">
      <input
        type="checkbox"
        checked={completed}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="checkmark"></span>
      {label && <p>{label}</p>}
    </label>
  );
};
