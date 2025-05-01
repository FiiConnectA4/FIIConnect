import React, { useState, useEffect } from "react";

const OrarProfesori = ({ onProfessorClick }) => {
  const [profesori, setProfesori] = useState([]); // Stocăm lista profesorilor
  const [loading, setLoading] = useState(true); // Indicator de încărcare

  // Funcție pentru a prelua profesorii din baza de date
  const fetchProfesori = async () => {
    try {
      const response = await fetch("http://localhost:34101/orar/profesori");
      if (!response.ok) {
        throw new Error("Eroare la preluarea profesorilor");
      }
      const data = await response.json();
      console.log("Profesori primiți:", data); // Verifică structura datelor

      // Procesăm lista profesorilor pentru a separa numele multiple
      const profesoriUnici = [...new Set(
        data.flatMap((profesor) =>
          profesor.split(",").map((nume) => nume.trim()) // Separăm după virgulă și eliminăm spațiile
        )
      )];

      setProfesori(profesoriUnici); // Actualizăm lista profesorilor
    } catch (error) {
      console.error("Eroare:", error);
    } finally {
      setLoading(false); // Dezactivăm indicatorul de încărcare
    }
  };

  // Efect pentru a prelua profesorii la montarea componentei
  useEffect(() => {
    fetchProfesori();
  }, []);

  const handleProfesorSelect = (profesor) => {
    onProfessorClick(profesor); // Apelează funcția din props pentru a seta profesorul selectat
  };

  if (loading) {
    return <div>Se încarcă lista profesorilor...</div>; // Afișăm un mesaj de încărcare
  }

  return (
    <div className="orar-profesori-container">
      <div className="orar-buttons">
        {profesori.map((profesor, index) => (
          <div className="dropdown-container" key={index}>
            <button
              className="orar-button"
              onClick={() => handleProfesorSelect(profesor)}
            >
              👨‍🏫 {profesor}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrarProfesori;