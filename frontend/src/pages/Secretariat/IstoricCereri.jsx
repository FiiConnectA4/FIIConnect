import React from "react";
import { useNavigate } from "react-router-dom";
import "./IstoricCereri.css"; // Creează un fișier CSS pentru stiluri

const IstoricCereri = () => {
  const navigate = useNavigate();

  // Schiță pentru cererile utilizatorului (momentan hardcodate)
  const cereri = [
    { id: 1, tip: "Cerere Decontare CTP", data: "2023-05-01", status: "Aprobat" },
    { id: 2, tip: "Cerere Bursă Socială", data: "2023-04-15", status: "În așteptare" },
    { id: 3, tip: "Cerere Adeverință Student", data: "2023-03-20", status: "Respins" },
  ];

  return (
    <div className="istoric-cereri-container">
      <h1>Istoric Cereri</h1>
      <table className="istoric-cereri-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tip Cerere</th>
            <th>Data</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {cereri.map((cerere) => (
            <tr key={cerere.id}>
              <td>{cerere.id}</td>
              <td>{cerere.tip}</td>
              <td>{cerere.data}</td>
              <td>{cerere.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => navigate(-1)} className="back-button">
        Înapoi
      </button>
    </div>
  );
};

export default IstoricCereri;