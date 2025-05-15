import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./IstoricCereri.css";
// import { AuthContext } from "../context/AuthContext"; // dacă ai un context

const IstoricCereri = () => {
  const navigate = useNavigate();
  const [cereri, setCereri] = useState([]);

  // const { user } = useContext(AuthContext);
  // const studentId = user?.id;
  const studentId = 7; // temporar hardcodat

useEffect(() => {
  if (!studentId) return;

  const fetchAdeverinte = fetch(`/cereri/adeverinta-student/student/${studentId}`).then(res => res.json());
  const fetchCamin = fetch(`/cereri/adeverinta-camin/student/${studentId}`).then(res => res.json());
  const fetchCazSocial = fetch(`/cereri/caz-social/student/${studentId}`).then(res => res.json());
  const fetchBursaSociala = fetch(`/cereri/bursa-sociala/student/${studentId}`).then(res => res.json());

  Promise.all([fetchAdeverinte, fetchCamin, fetchCazSocial, fetchBursaSociala])
    .then(([adeverinteData, caminData, cazSocialData, bursaSocialaData]) => {
      if (!Array.isArray(adeverinteData)) adeverinteData = [];
      if (!Array.isArray(caminData)) caminData = [];
      if (!Array.isArray(cazSocialData)) cazSocialData = [];
      if (!Array.isArray(bursaSocialaData)) bursaSocialaData = [];

      const transformedAdeverinte = adeverinteData.map(c => ({
        id: c.id,
        tip: c.tip || "Adeverință Student",
        data: c.dataTrimitere,
        status: c.status,
        comentariu: c.comentariu,
      }));

      const transformedCamin = caminData.map(c => ({
        id: c.id,
        tip: c.tip || "Adeverință Cămin",
        data: c.dataTrimitere,
        status: c.status,
        comentariu: c.comentariu,
      }));

      const transformedCazSocial = cazSocialData.map(c => ({
        id: c.id,
        tip: c.tip || "Cerere Caz Social",
        data: c.dataTrimitere,
        status: c.status,
        comentariu: c.comentariu,
      }));

      const transformedBursaSociala = bursaSocialaData.map(c => ({
        id: c.id,
        tip: c.tip || "Cerere Bursa Socială",
        data: c.dataTrimitere,
        status: c.status,
        comentariu: c.comentariu,
      }));

      setCereri([...transformedAdeverinte, ...transformedCamin, ...transformedCazSocial, ...transformedBursaSociala]);
    })
    .catch(err => {
      console.error("Eroare la încărcarea cererilor:", err);
    });
}, [studentId]);




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
          {cereri.length > 0 ? (
            cereri.map((cerere) => (
              <tr key={cerere.id}>
                <td>{cerere.id}</td>
                <td>{cerere.tip}</td>
                <td>{cerere.data}</td>
                <td>
                  {cerere.status}
                  {cerere.status === "Respins" && cerere.comentariu && (
                    <div style={{ fontSize: "0.8em", color: "red" }}>
                      Comentariu: {cerere.comentariu}
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Nu există cereri trimise.</td>
            </tr>
          )}
        </tbody>
      </table>
      <button onClick={() => navigate(-1)} className="back-button">
        Înapoi
      </button>
    </div>
  );
};

export default IstoricCereri;
