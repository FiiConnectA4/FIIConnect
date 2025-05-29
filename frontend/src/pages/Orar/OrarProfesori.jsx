import React, { useState, useEffect } from "react";

const OrarProfesori = ({ onProfessorClick }) => {
  const [profesori, setProfesori] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfesori = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:34101/orar/profesori", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Eroare la preluarea profesorilor");
      }
      const data = await response.json();
      console.log("Profesori primiți:", data);
      setProfesori(data);
    } catch (error) {
      console.error("Eroare:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfesori();
  }, []);

  const handleProfesorSelect = (profesorId) => {
    onProfessorClick(profesorId); // trimitem doar id-ul profesorului
  };

  if (loading) {
    return <div>Se încarcă lista profesorilor...</div>;
  }

  return (
    <div className="orar-profesori-container">
      <div className="orar-buttons">
        {profesori.map((profesor) => (
          <button
            key={profesor.id}
            className="orar-button"
            onClick={() => handleProfesorSelect(profesor.id)}
          >
            👨‍🏫 {profesor.firstName} {profesor.lastName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrarProfesori;
