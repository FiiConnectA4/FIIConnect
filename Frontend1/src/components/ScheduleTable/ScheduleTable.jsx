import React from "react";
import "./ScheduleTable.css";

const ScheduleTable = ({ schedule, title }) => {
  return (
    <div className="schedule-table-container">
      <h2>{title}</h2>
      {schedule.length === 0 ? (
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Zi</th>
              <th>Interval</th>
              <th>Disciplina</th>
              <th>Tip</th>
              <th>Grupa Studentilor</th>
              <th>Sala</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                Nu există date disponibile pentru afișare.
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Zi</th>
              <th>Interval</th>
              <th>Disciplina</th>
              <th>Tip</th>
              <th>Grupa Studentilor</th>
              <th>Sala</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((entry, index) => (
              <tr key={index}>
                <td>{entry.zi}</td>
                <td>
                  {entry.oraStart} - {entry.oraEnd}
                </td>
                <td>{entry.disciplina}</td>
                <td>{entry.tip}</td>
                <td>{entry.grupa || "-"}</td>
                <td>{entry.sala}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ScheduleTable;
