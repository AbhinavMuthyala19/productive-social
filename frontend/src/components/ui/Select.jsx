import "./Select.css";

export const Select = ({ options = [], value, onChange }) => {
  return (
    <select className="select" value={value} onChange={onChange}>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
