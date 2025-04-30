import React, { useState, useEffect } from "react";
import "./ScheduleTable.css";

const ScheduleTable = ({ schedule, title, showSala = true, editable = false, onDataChange }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [scheduleData, setScheduleData] = useState(schedule);
  useEffect(() => {
    setScheduleData(schedule);
  }, [schedule]);

  // Funcție pentru a actualiza state-ul componentelor de orar


  /*const handleEditClick = (entry) => {
    setSelectedEntry(entry);
    setFormData(entry); // inițializezi formularul cu valorile existente
    setShowPopup(true);
    setIsEditing(false);
  };*/

  const handleEditClick = (entry) => {
    const entryWithId = {
      ...entry,
      id: entry.id ?? entry._id ?? null // fallback dacă folosești Mongo sau ai id-ul în altă formă
    };
  
    setSelectedEntry(entryWithId);
    setFormData(entryWithId);
    setShowPopup(true);
    setIsEditing(false);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedEntry(null);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value, id: prev.id }));
  };

  const handleDeleteEntry = () => {
    fetch(`http://localhost:34101/orar/${selectedEntry.id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          // Actualizează lista de date după ștergere
          onDataChange(schedule.filter((item) => item.id !== selectedEntry.id));
          closePopup();
        }
      })
      .catch((err) => console.error("Eroare la ștergere:", err));
  };

  /*const handleSaveEdit = () => {
    const isNew = !formData.id;

    const payload = { ...formData };
    if (isNew) delete payload.id; // elimină id-ul pentru POST

      const url = isNew
      ? "http://localhost:34101/orar"
      : `http://localhost:34101/orar/${formData.id}`;  
    const method = isNew ? "POST" : "PUT";
  
    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Eroare la salvare");
        return res.json();
      })
        .then((data) => {
          // 💡 reconstruim intervalul dacă lipsește
          if ((!data.interval || data.interval.trim() === "") && data.oraStart && data.oraEnd) {
            data.interval = `${data.oraStart} - ${data.oraEnd}`;
          }
        
          if (isNew) {
            setScheduleData((prev) => [...prev, data]);
          } else {
            setScheduleData((prev) =>
              prev.map((item) => (item.id === data.id ? data : item))
            );
          }
        
          closePopup();
        });
        

      //.catch((err) => console.error("Eroare la salvare:", err));
  };
*/
const handleSaveEdit = () => {
  const isNew = !formData.id;

  // 🧠 Sparge intervalul nou introdus în oraStart și oraEnd
  let oraStart = null;
  let oraEnd = null;

  if (formData.interval && formData.interval.includes(" - ")) {
    const parts = formData.interval.split(" - ");
    oraStart = parts[0].trim();
    oraEnd = parts[1].trim();
  }

  const payload = {
    ...formData,
    oraStart,
    oraEnd
  };

  const url = isNew
    ? "http://localhost:34101/orar"
    : `http://localhost:34101/orar/${formData.id}`;
  const method = isNew ? "POST" : "PUT";

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Eroare la salvare");
      return res.json();
    })
    .then((data) => {
      // reconstruim intervalul din datele salvate
      if (!data.interval && data.oraStart && data.oraEnd) {
        data.interval = `${data.oraStart} - ${data.oraEnd}`;
      }

      if (isNew) {
        setScheduleData((prev) => [...prev, data]);
      } else {
        setScheduleData((prev) =>
          prev.map((item) => (item.id === data.id ? data : item))
        );
      }

      closePopup();
    })
    .catch((err) => console.error("Eroare la salvare:", err));
};

  const handleAddNew = () => {
    const newEntry = {
      id: null, // Fără ID pentru intrarea nouă
      zi: "Luni",
      interval: "08:00 - 10:00",
      oraStart: "08:00",
      oraEnd: "10:00",
      disciplina: "Nouă Disciplina",
      tip: "Curs",
      grupa: "A1",
      sala: "C101",
      profesor: "Profesor Nou",
      an: 1,
    };

    setSelectedEntry(newEntry);
    setFormData(newEntry);
    setShowPopup(true);
    setIsEditing(true);
  };

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
            <th>Grupa</th>
            {showSala && <th>Sală</th>}
            <th>Profesor</th>
            <th>An</th>
            {editable && <th>Acțiuni</th>}
          </tr>
        </thead>
        <tbody>
          {scheduleData.length === 0 ? (
            <tr>
              <td colSpan={showSala ? (editable ? 9 : 8) : (editable ? 8 : 7)} style={{ textAlign: "center" }}>
                Nu există date disponibile pentru afișare.
                {editable && (
                  <div style={{ marginTop: "10px" }}>
                    <button className="add-button" onClick={handleAddNew}>➕ Adaugă o intrare nouă</button>
                  </div>
                )}
              </td>
            </tr>
          ) : (
            scheduleData.map((entry) => (
              <tr key={`${entry.id ?? entry.disciplina}-${entry.zi}-${entry.interval}`}>
                <td>{entry.zi}</td>
                <td>{entry.interval}</td>
                <td>{entry.disciplina}</td>
                <td>{entry.tip}</td>
                <td>{entry.grupa}</td>
                {showSala && <td>{entry.sala}</td>}
                <td>{entry.profesor}</td>
                <td>{entry.an}</td>
                {editable && (
                  <td>
                    <button className="edit-button" onClick={() => handleEditClick(entry)}>
                      ✏️ Editare
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            {!isEditing ? (
              <>
                <h3>Alege o acțiune</h3>
                <p>Editezi rândul: {selectedEntry?.disciplina}</p>
                <button onClick={handleAddNew}>➕ Adaugă Nou</button>
                <button onClick={() => setIsEditing(true)}>✏️ Modifică</button>
                <button onClick={handleDeleteEntry}>🗑️ Șterge</button>
                <button onClick={closePopup}>Închide</button>
              </>
            ) : (
              <>
                <h3>Modifică înregistrarea</h3>
                <form>
                  <label>
                    Zi:
                    <select name="zi" value={formData.zi} onChange={handleChange}>
                      {["Luni", "Marti", "Miercuri", "Joi", "Vineri"].map((z) => (
                        <option key={z} value={z}>{z}</option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Interval:
                    <input name="interval" value={formData.interval} onChange={handleChange} />
                  </label>

                  <label>
                    Disciplina:
                    <input name="disciplina" value={formData.disciplina} onChange={handleChange} list="discipline-list" />
                    <datalist id="discipline-list">
                      {[...new Set(scheduleData.map(e => e.disciplina).filter(Boolean))].map((d) => (
                        <option key={d} value={d} />
                      ))}
                    </datalist>
                  </label>

                  <label>
                    Tip:
                    <select name="tip" value={formData.tip} onChange={handleChange}>
                      <option value="Curs">Curs</option>
                      <option value="Laborator">Laborator</option>
                      <option value="Seminar">Seminar</option>
                    </select>
                  </label>

                  <label>
                    Grupa:
                    <input name="grupa" value={formData.grupa} onChange={handleChange} list="grupe-list" />
                    <datalist id="grupe-list">
                      {[...new Set(scheduleData.map(e => e.grupa).filter(Boolean))].map((g) => (
                        <option key={g} value={g} />
                      ))}
                    </datalist>
                  </label>

                  <label>
                    Sala:
                    <input name="sala" value={formData.sala} onChange={handleChange} list="sali-list" />
                    <datalist id="sali-list">
                      {[...new Set(scheduleData.map(e => e.sala).filter(Boolean))].map((s) => (
                        <option key={s} value={s} />
                      ))}
                    </datalist>
                  </label>

                  <label>
                    Profesor:
                    <input name="profesor" value={formData.profesor} onChange={handleChange} list="profesori-list" />
                    <datalist id="profesori-list">
                      {[...new Set(scheduleData.map(e => e.profesor).filter(Boolean))].map((p) => (
                        <option key={p} value={p} />
                      ))}
                    </datalist>
                  </label>

                  <label>
                    An:
                    <input name="an" type="number" value={formData.an} onChange={handleChange} />
                  </label>
                </form>

                <button onClick={handleSaveEdit}>💾 Salvează</button>
                <button onClick={closePopup}>Anulează</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleTable;
