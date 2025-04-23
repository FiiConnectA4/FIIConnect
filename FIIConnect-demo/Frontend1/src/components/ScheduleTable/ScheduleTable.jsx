import React from "react";
import "./ScheduleTable.css";

const ScheduleTable = ({ schedule, title, showSala = true }) => {
  // Verifică dacă 'schedule' este un array valid înainte de a încerca să-l mapăm
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
            <th>Grupa Studentilor</th>
            {showSala && <th>Sală</th>}
            <th>Profesor</th>
            <th>An</th> {/* Coloană pentru an */}
          </tr>
        </thead>
        <tbody>
          {schedule.length === 0 ? (
            <tr>
              <td colSpan={showSala ? 8 : 7} style={{ textAlign: "center" }}>
                Nu există date disponibile pentru afișare.
              </td>
            </tr>
          ) : (
            schedule.map((entry, index) => {
              console.log("Entry:", entry); // Verifică structura obiectului `entry`

              // Asigură-te că avem valori corecte pentru profesor și an
              let an = entry.an || "-";  // Dacă nu există, afișează "-"
              let profesor = entry.profesor || "-";  // Dacă nu există, afișează "-"

              return (
                <tr key={index}>
                  <td>{entry.zi}</td>
                  <td>{entry.interval}</td>
                  <td>{entry.disciplina}</td>
                  <td>{entry.tip}</td>
                  <td>{entry.grupa || "-"}</td>
                  {showSala && <td>{entry.sala}</td>}
                  <td>{profesor}</td> {/* Afișează profesorul */}
                  <td>{an}</td> {/* Afișează anul */}
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
