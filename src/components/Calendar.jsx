import "./Calendar.css";

function Calendar({ value, onChange }) {
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <div className="calendar-container">
      <input
        type="date"
        value={value}
        min={today}
        onChange={(e) => onChange(e.target.value)}
        className="calendar-input"
      />
    </div>
  );
}

export default Calendar;