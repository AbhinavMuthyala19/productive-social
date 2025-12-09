import "./Checkbox.css";

export const Checkbox = ({ checked, onChange, label }) => {
  return (
    <label className="checkbox-container">
      <input 
      className="checkmark"
        type="checkbox" 
        checked={checked} 
        onChange={onChange} 
      />
      {label && <p>{label}</p>}
    </label>
  );
}
