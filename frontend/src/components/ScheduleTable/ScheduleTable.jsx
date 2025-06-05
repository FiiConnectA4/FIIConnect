import React, { useState } from "react";
import "./ScheduleTable.css";

const zileSaptamana = ["Luni", "Marti", "Miercuri", "Joi", "Vineri", "Sambata", "Duminica"];

export const sorteazaOrar = (orar) => {
  return [...orar].sort((a, b) => {
    const ziA = zileSaptamana.indexOf(a.zi);
    const ziB = zileSaptamana.indexOf(b.zi);

    if (ziA !== ziB) return ziA - ziB;

    const oraStartA = a.interval?.split(" - ")[0] || "00:00";
    const oraStartB = b.interval?.split(" - ")[0] || "00:00";

    const [oraA, minutA] = oraStartA.split(":").map(Number);
    const [oraB, minutB] = oraStartB.split(":").map(Number);

    return oraA !== oraB ? oraA - oraB : minutA - minutB;
  });
};

const ScheduleTable = ({ schedule, title, showSala = true, editable = false, onDataChange }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [availableProfessors, setAvailableProfessors] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);

  const sortedSchedule = sorteazaOrar(schedule);

  // Funcție pentru încărcarea profesorilor și disciplinelor
  const loadProfessorsAndCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const [professorResponse, courseResponse] = await Promise.all([
        fetch(`http://localhost:34101/orar/profesori`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`http://localhost:34101/orar/discipline`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (professorResponse.ok && courseResponse.ok) {
        const professors = await professorResponse.json();
        const courses = await courseResponse.json();

        setAvailableProfessors(professors);
        setAvailableCourses(courses);

        console.log("Profesori încărcați:", professors);
        console.log("Discipline încărcate:", courses);
      }
    } catch (error) {
      console.error("Eroare la încărcarea datelor:", error);
    }
  };

  // Funcție pentru verificarea permisiunilor
  const checkUserPermissions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;

      const response = await fetch("http://localhost:34101/person/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        console.log("Date utilizator:", userData);
        console.log("Rol utilizator:", userData.role);

        // Verifică dacă utilizatorul are rol de SECRETARIAT sau ADMIN (cu sau fără prefix ROLE_)
        const role = userData.role;
        return role === "SECRETARIAT" || role === "ADMIN" ||
            role === "ROLE_SECRETARIAT" || role === "ROLE_ADMIN";
      }
      return false;
    } catch (error) {
      console.error("Eroare la verificarea permisiunilor:", error);
      return false;
    }
  };

  const handleEditClick = async (entry) => {
    // Asigură-te că ID-ul este setat corect
    const entryWithId = {
      ...entry,
      id: entry.id || entry._id || null
    };
    setSelectedEntry(entryWithId);
    setFormData(entryWithId);
    setShowPopup(true);
    setIsEditing(false);

    // Încarcă profesorii și disciplinele când se deschide popup-ul
    await loadProfessorsAndCourses();
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedEntry(null);
    setIsEditing(false);
    setFormData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeleteEntry = async () => {
    if (!selectedEntry?.id) {
      console.error("Nu există ID pentru ștergere");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Nu ești autentificat. Te rog să te loghezi din nou.");
      return;
    }

    // Verifică permisiunile utilizatorului
    const hasPermission = await checkUserPermissions();
    if (!hasPermission) {
      alert("Nu ai permisiunile necesare pentru a șterge din orar. Doar secretariatul poate modifica datele.");
      return;
    }

    console.log("Ștergere intrare cu ID:", selectedEntry.id);
    console.log("Token folosit:", token.substring(0, 20) + "...");

    fetch(`http://localhost:34101/orar/${selectedEntry.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
        .then((res) => {
          if (res.ok) {
            const updated = schedule.filter((item) =>
                (item.id || item._id) !== selectedEntry.id
            );
            onDataChange(updated);
            closePopup();
          } else {
            throw new Error(`Eroare HTTP: ${res.status}`);
          }
        })
        .catch((err) => {
          console.error("Eroare la ștergere:", err);
          alert("Eroare la ștergerea intrării. Verifică consola pentru detalii.");
        });
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem("token");

    // Verifică dacă există token
    if (!token) {
      alert("Nu ești autentificat. Te rog să te loghezi din nou.");
      return;
    }

    // Verifică permisiunile utilizatorului
    const hasPermission = await checkUserPermissions();
    if (!hasPermission) {
      alert("Nu ai permisiunile necesare pentru a edita orarul. Doar secretariatul poate modifica datele.");
      return;
    }

    console.log("Token folosit:", token.substring(0, 20) + "...");

    const isNew = !formData.id;

    // Procesează intervalul pentru a extrage ora de start și sfârșit
    let oraStart = null, oraEnd = null;
    if (formData.interval && formData.interval.includes(" - ")) {
      const parts = formData.interval.split(" - ");
      oraStart = parts[0].trim();
      oraEnd = parts[1].trim();
    }

    try {
      // Încarcă profesorii și disciplinele existente
      const [professorResponse, courseResponse] = await Promise.all([
        fetch(`http://localhost:34101/orar/profesori`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`http://localhost:34101/orar/discipline`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (!professorResponse.ok || !courseResponse.ok) {
        throw new Error("Nu s-au putut încărca datele necesare");
      }

      const professors = await professorResponse.json();
      const courses = await courseResponse.json();

      console.log("Profesori disponibili:", professors);
      console.log("Discipline disponibile:", courses);

      // Pentru editare, dacă avem deja obiectele complete, le folosim
      let professor = null;
      let course = null;

      if (!isNew && selectedEntry) {
        // Pentru editare, încearcă să găsești obiectele originale
        const professorName = formData.profesor || selectedEntry.profesor;
        const courseName = formData.disciplina || selectedEntry.disciplina;

        professor = professors.find(p =>
            `${p.firstName} ${p.lastName}` === professorName ||
            `${p.firstName} ${p.lastName}`.trim() === professorName.trim()
        );

        course = courses.find(c =>
            c.title === courseName ||
            c.title.toLowerCase() === courseName.toLowerCase()
        );
      } else {
        // Pentru intrări noi, caută pe baza input-ului
        const professorName = formData.profesor || "";
        const courseName = formData.disciplina || "";

        professor = professors.find(p =>
            `${p.firstName} ${p.lastName}` === professorName ||
            `${p.firstName} ${p.lastName}`.trim() === professorName.trim()
        );

        course = courses.find(c =>
            c.title === courseName ||
            c.title.toLowerCase() === courseName.toLowerCase()
        );
      }

      console.log("Profesor găsit:", professor);
      console.log("Disciplină găsită:", course);

      if (!professor) {
        const availableProfs = professors.map(p => `${p.firstName} ${p.lastName}`).join(", ");
        alert(`Profesorul "${formData.profesor}" nu a fost găsit în sistem.\n\nProfesori disponibili: ${availableProfs}`);
        return;
      }

      if (!course) {
        const availableCourses = courses.map(c => c.title).join(", ");
        alert(`Disciplina "${formData.disciplina}" nu a fost găsită în sistem.\n\nDiscipline disponibile: ${availableCourses}`);
        return;
      }

      // Construiește payload-ul cu obiectele complete
      const payload = {
        zi: formData.zi,
        oraStart: oraStart,
        oraEnd: oraEnd,
        disciplina: course,    // Obiect complet Course
        tip: formData.tip,
        grupa: formData.grupa,
        sala: formData.sala,
        profesor: professor,   // Obiect complet Professor
        an: formData.an
      };

      console.log("Payload final trimis:", payload);

      const url = isNew
          ? "http://localhost:34101/orar"
          : `http://localhost:34101/orar/${formData.id}`;
      const method = isNew ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Eroare HTTP: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Date primite de la server:", data);

      // Construiește obiectul pentru frontend cu intervalul corect
      const frontendData = {
        id: data.id,
        zi: data.zi,
        interval: `${data.oraStart} - ${data.oraEnd}`,
        disciplina: data.disciplina?.title || course.title,
        tip: data.tip,
        grupa: data.grupa,
        sala: data.sala,
        profesor: `${data.profesor?.firstName || professor.firstName} ${data.profesor?.lastName || professor.lastName}`.trim(),
        an: data.an
      };

      // Actualizează lista de date
      const updated = isNew
          ? [...schedule, frontendData]
          : schedule.map((item) => {
            const itemId = item.id || item._id;
            return itemId === frontendData.id ? frontendData : item;
          });

      onDataChange(updated);
      closePopup();

    } catch (error) {
      console.error("Eroare la salvare:", error);
      alert(`Eroare la salvarea datelor: ${error.message}`);
    }
  };

  const handleAddNew = async () => {
    const newEntry = {
      id: null,
      zi: "Luni",
      interval: "08:00 - 10:00",
      disciplina: "",
      tip: "Curs",
      grupa: "A1",
      sala: "C101",
      profesor: "",
      an: 1,
    };

    setSelectedEntry(newEntry);
    setFormData(newEntry);
    setShowPopup(true);
    setIsEditing(true);

    // Încarcă profesorii și disciplinele când se deschide popup-ul
    await loadProfessorsAndCourses();
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
          {sortedSchedule.length === 0 ? (
              <tr>
                <td colSpan={showSala ? (editable ? 9 : 8) : (editable ? 8 : 7)} style={{ textAlign: "center" }}>
                  Nu există date disponibile pentru afișare.
                  {editable && (
                      <div style={{ marginTop: "10px" }}>
                        <button className="add-button" onClick={handleAddNew}>
                          ➕ Adaugă o intrare nouă
                        </button>
                      </div>
                  )}
                </td>
              </tr>
          ) : (
              sortedSchedule.map((entry, index) => (
                  <tr key={entry.id || entry._id || `${entry.disciplina}-${entry.zi}-${entry.interval}-${index}`}>
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

        {editable && sortedSchedule.length > 0 && (
            <div style={{ marginTop: "10px", textAlign: "center" }}>
              <button className="add-button" onClick={handleAddNew}>
                ➕ Adaugă o intrare nouă
              </button>
            </div>
        )}

        {showPopup && (
            <div className="popup-overlay">
              <div className="popup-content">
                {!isEditing ? (
                    <>
                      <h3>Alege o acțiune</h3>
                      <p>Editezi rândul: {selectedEntry?.disciplina}</p>
                      <button onClick={() => setIsEditing(true)}>✏️ Modifică</button>
                      <button onClick={handleDeleteEntry}>🗑️ Șterge</button>
                      <button onClick={closePopup}>Închide</button>
                    </>
                ) : (
                    <>
                      <h3>{formData.id ? "Modifică înregistrarea" : "Adaugă înregistrare nouă"}</h3>
                      <form onSubmit={(e) => e.preventDefault()}>
                        <label>
                          Zi:
                          <select name="zi" value={formData.zi || "Luni"} onChange={handleChange}>
                            {["Luni", "Marti", "Miercuri", "Joi", "Vineri"].map((z) => (
                                <option key={z} value={z}>{z}</option>
                            ))}
                          </select>
                        </label>
                        <label>
                          Interval:
                          <input
                              name="interval"
                              value={formData.interval || ""}
                              onChange={handleChange}
                              placeholder="08:00 - 10:00"
                          />
                        </label>
                        <label>
                          Disciplina:
                          <input
                              name="disciplina"
                              value={formData.disciplina || ""}
                              onChange={handleChange}
                              list="discipline-list"
                              placeholder="Selectează sau tastează disciplina"
                          />
                          <datalist id="discipline-list">
                            {/* Afișează disciplinele din baza de date */}
                            {availableCourses.map((c) => (
                                <option key={c.id} value={c.title} />
                            ))}
                            {/* Fallback: disciplinele din programul curent */}
                            {[...new Set(schedule.map(e => e.disciplina).filter(Boolean))].map((d) => (
                                <option key={d} value={d} />
                            ))}
                          </datalist>
                        </label>
                        <label>
                          Tip:
                          <select name="tip" value={formData.tip || "Curs"} onChange={handleChange}>
                            <option value="Curs">Curs</option>
                            <option value="Laborator">Laborator</option>
                            <option value="Seminar">Seminar</option>
                          </select>
                        </label>
                        <label>
                          Grupa:
                          <input
                              name="grupa"
                              value={formData.grupa || ""}
                              onChange={handleChange}
                              list="grupe-list"
                          />
                          <datalist id="grupe-list">
                            {[...new Set(schedule.map(e => e.grupa).filter(Boolean))].map((g) => (
                                <option key={g} value={g} />
                            ))}
                          </datalist>
                        </label>
                        <label>
                          Sala:
                          <input
                              name="sala"
                              value={formData.sala || ""}
                              onChange={handleChange}
                              list="sali-list"
                          />
                          <datalist id="sali-list">
                            {[...new Set(schedule.map(e => e.sala).filter(Boolean))].map((s) => (
                                <option key={s} value={s} />
                            ))}
                          </datalist>
                        </label>
                        <label>
                          Profesor:
                          <input
                              name="profesor"
                              value={formData.profesor || ""}
                              onChange={handleChange}
                              list="profesori-list"
                              placeholder="Selectează sau tastează profesorul"
                          />
                          <datalist id="profesori-list">
                            {/* Afișează profesorii din baza de date */}
                            {availableProfessors.map((p) => (
                                <option key={p.id} value={`${p.firstName} ${p.lastName}`} />
                            ))}
                            {/* Fallback: profesorii din programul curent */}
                            {[...new Set(schedule.map(e => e.profesor).filter(Boolean))].map((p) => (
                                <option key={p} value={p} />
                            ))}
                          </datalist>
                        </label>
                        <label>
                          An:
                          <input
                              name="an"
                              type="number"
                              value={formData.an || ""}
                              onChange={handleChange}
                              min="1"
                              max="4"
                          />
                        </label>
                      </form>
                      <div style={{ marginTop: "15px" }}>
                        <button onClick={handleSaveEdit} style={{ marginRight: "10px" }}>
                          💾 Salvează
                        </button>
                        <button onClick={closePopup}>
                          Anulează
                        </button>
                      </div>
                    </>
                )}
              </div>
            </div>
        )}
      </div>
  );
};

export default ScheduleTable;