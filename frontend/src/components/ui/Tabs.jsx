import "./Tabs.css";

export const Tabs = ({ tabs = [], active, onChange }) => {
  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`tab-item ${active === tab ? "active" : ""}`}
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
