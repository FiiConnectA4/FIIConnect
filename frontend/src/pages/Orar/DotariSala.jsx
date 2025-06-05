import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const DotariSala = ({ isSecretariat = false }) => {
  const { sala } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Override isSecretariat dacă ruta curentă e din secretariat
  const isSecretariatRoute = location.pathname.startsWith('/app/orar-secretariat');
  const actualIsSecretariat = isSecretariat || isSecretariatRoute;

  const [salaData, setSalaData] = useState(null);
  const [editData, setEditData] = useState({
    dotari: '',
    capacitate: '',
    observatii: '',
  });

  // Mod editare activ
  const [isEditing, setIsEditing] = useState(false);

  const role = localStorage.getItem("role");
  const isAdmin = role === "ROLE_ADMIN";
  const isSecretar = role === "SECRETAR";

  // butonul de editare se arata doar pentru admin
  // alte permisiuni pot fi folosite separat dacă vrei

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:34101/sali/nume/${sala}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const salaObj = data[0];
        setSalaData(salaObj);
        setEditData({
          dotari: salaObj.dotari || '',
          capacitate: salaObj.capacitate || '',
          observatii: salaObj.observatii || '',
        });
      })
      .catch(err => console.error('Eroare la preluarea dotărilor:', err));
  }, [sala]);

  const handleBackClick = () => {
    const basePath = actualIsSecretariat ? "/app/orar-secretariat/sali" : "/app/orar/sali";
    navigate(`${basePath}/${sala}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

const handleSave = () => {
  if (!sala) {
    alert("Numele sălii nu este disponibil.");
    return;
  }
  const token = localStorage.getItem("token");

  fetch(`http://localhost:34101/sali/nume/${sala}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(editData),
  })
    .then(res => {
      if (res.ok) {
        alert("Actualizare reușită!");
        setSalaData(prev => ({ ...prev, ...editData }));
        setIsEditing(false);
      } else {
        alert("Eroare la actualizare!");
      }
    })
    .catch(() => alert("Eroare la server."));
};


  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      dotari: salaData.dotari || '',
      capacitate: salaData.capacitate || '',
      observatii: salaData.observatii || '',
    });
  };

  return (
    <div className="dotari-container">
      <h2>Dotări pentru {sala}</h2>

      {/* Afișează butonul doar dacă e admin și nu este deja în modul editare */}
      {isAdmin && !isEditing && (
        <button onClick={() => setIsEditing(true)}>Modifică</button>
      )}

      {isEditing ? (
        <>
          <label>
            Dotări:<br />
            <input
              name="dotari"
              value={editData.dotari}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Capacitate:<br />
            <input
              name="capacitate"
              type="number"
              value={editData.capacitate}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Observații:<br />
            <textarea
              name="observatii"
              value={editData.observatii}
              onChange={handleChange}
            />
          </label>
          <br />
          <button onClick={handleSave}>Salvează modificările</button>
          <button onClick={handleCancel}>Anulează</button>
        </>
      ) : salaData ? (
        <>
          {/* Imagine centrată și mare */}
          <div style={{ textAlign: "center", marginBottom: "2em" }}>
            <img
              src={`/img/${sala}.jpg`}
              alt={`Imagine pentru sala ${sala}`}
              style={{
                width: "600px",
                maxWidth: "90%",
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
              }}
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>

          {/* Textul cu detaliile */}
          <ul>
            <li><strong>Dotări:</strong> {salaData.dotari}</li>
            <li><strong>Capacitate:</strong> {salaData.capacitate}</li>
            <li><strong>Observații:</strong> {salaData.observatii}</li>
          </ul>
        </>
      ) : (
        <p>Se încarcă dotările...</p>
      )}

      <button className="dotari-back-button" onClick={handleBackClick}>
        🔙 Înapoi
      </button>
    </div>
  );
};

export default DotariSala;
