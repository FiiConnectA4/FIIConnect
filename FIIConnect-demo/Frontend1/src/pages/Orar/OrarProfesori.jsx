import React, { useState, useEffect } from "react";

const OrarProfesori = ({ onProfessorClick }) => {
  const [profesori, setProfesori] = useState([]); 
  const [loading, setLoading] = useState(true); 

  
  const fetchProfesori = async () => {
    try {
      const response = await fetch("http://localhost:34101/orar/profesori");
      if (!response.ok) {
        throw new Error("Eroare la preluarea profesorilor");
      }
      const data = await response.json();
      console.log("Profesori primiți:", data); 

      
      const profesoriUnici = [...new Set(
        data.flatMap((profesor) =>
          profesor.split(",").map((nume) => nume.trim()) 
        )
      )];

      setProfesori(profesoriUnici); 
    } catch (error) {
      console.error("Eroare:", error);
    } finally {
      setLoading(false); 
    }
  };

  
  useEffect(() => {
    fetchProfesori();
  }, []);

  const handleProfesorSelect = (profesor) => {
    onProfessorClick(profesor); 
  };

  if (loading) {
    return <div>Se încarcă lista profesorilor...</div>; 
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