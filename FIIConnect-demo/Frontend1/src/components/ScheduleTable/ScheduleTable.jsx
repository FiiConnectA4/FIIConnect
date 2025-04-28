import React from "react";
import "./ScheduleTable.css";

const ScheduleTable = ({ schedule, title, showSala = true, editable = false, onEditClick }) => {
  if (!Array.isArray(schedule)) {
    return (
      <div className="schedule-table-container">
        <h2>{title}</h2>
        <p style={{ textAlign: "center" }}>Nu există date valide pentru acest orar.</p>
      </div>
    );
  }

  return (
    <div className="schedule-table-container">
      <h2>{title}</h2>
      <table className="schedule-table">
        <thead>
          <tr>
            <th>Zi</th>
            <th>Interval</th>
            <th>Disciplina</th>
            <th>Tip</th>
            <th>Grupa Studenților</th>
            {showSala && <th>Sală</th>}
            <th>Profesor</th>
            <th>An</th>
            {editable && <th>Acțiuni</th>} {/* Afișăm coloana de editare doar dacă editable */}
          </tr>
        </thead>
        <tbody>
          {schedule.length === 0 ? (
            <tr>
              <td colSpan={showSala ? (editable ? 9 : 8) : (editable ? 8 : 7)} style={{ textAlign: "center" }}>
                Nu există date disponibile pentru afișare.
              </td>
            </tr>
          ) : (
            schedule.map((entry, index) => {
              const an = entry.an || "-";
              const profesor = entry.profesor || "-";

              return (
                <tr key={index}>
                  <td>{entry.zi}</td>
                  <td>{entry.interval}</td>
                  <td>{entry.disciplina}</td>
                  <td>{entry.tip}</td>
                  <td>{entry.grupa || "-"}</td>
                  {showSala && <td>{entry.sala}</td>}
                  <td>{profesor}</td>
                  <td>{an}</td>
                  {editable && (
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => onEditClick && onEditClick(entry)}
                      >
                        ✏️ Editare
                      </button>
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;
