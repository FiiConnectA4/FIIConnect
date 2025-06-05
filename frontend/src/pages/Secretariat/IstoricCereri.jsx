import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./IstoricCereri.css";

const IstoricCereri = () => {
  const navigate = useNavigate();
  const [cereri, setCereri] = useState([]);
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Nu ești autentificat!");
      return;
    }

    fetch("http://localhost:34101/person/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Nu s-a putut prelua persoana");
        return res.json();
      })
      .then((data) => {
        if (data.student && data.student.id) {
          setStudentId(data.student.id);
        } else {
          alert("Studentul nu este identificat în răspuns");
        }
      })
      .catch((err) => {
        alert("Eroare la preluarea persoanei: " + err.message);
      });
  }, []);

  useEffect(() => {
    if (!studentId) return;

    const token = localStorage.getItem("token");

    const fetchAdeverinte = fetch(`http://localhost:34101/cereri/adeverinta-student/student/${studentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => res.json());

    const fetchCamin = fetch(`http://localhost:34101/cereri/adeverinta-camin/student/${studentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => res.json());

    const fetchCazSocial = fetch(`http://localhost:34101/cereri/caz-social/student/${studentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => res.json());

    const fetchBursaSociala = fetch(`http://localhost:34101/cereri/bursa-sociala/student/${studentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => res.json());

    Promise.all([fetchAdeverinte, fetchCamin, fetchCazSocial, fetchBursaSociala])
      .then(([adeverinteData, caminData, cazSocialData, bursaSocialaData]) => {
        if (!Array.isArray(adeverinteData)) adeverinteData = [];
        if (!Array.isArray(caminData)) caminData = [];
        if (!Array.isArray(cazSocialData)) cazSocialData = [];
        if (!Array.isArray(bursaSocialaData)) bursaSocialaData = [];

        const transformedAdeverinte = adeverinteData.map((c) => ({
          id: c.id,
          tip: c.tip || "Adeverință Student",
          data: c.dataTrimitere,
          status: c.status,
          comentariu: c.comentariu,
        }));

        const transformedCamin = caminData.map((c) => ({
          id: c.id,
          tip: c.tip || "Adeverință Cămin",
          data: c.dataTrimitere,
          status: c.status,
          comentariu: c.comentariu,
        }));

        const transformedCazSocial = cazSocialData.map((c) => ({
          id: c.id,
          tip: c.tip || "Cerere Caz Social",
          data: c.dataTrimitere,
          status: c.status,
          comentariu: c.comentariu,
        }));

        const transformedBursaSociala = bursaSocialaData.map((c) => ({
          id: c.id,
          tip: c.tip || "Cerere Bursa Socială",
          data: c.dataTrimitere,
          status: c.status,
          comentariu: c.comentariu,
        }));

        setCereri([
          ...transformedAdeverinte,
          ...transformedCamin,
          ...transformedCazSocial,
          ...transformedBursaSociala,
        ]);
      })
      .catch((err) => {
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
