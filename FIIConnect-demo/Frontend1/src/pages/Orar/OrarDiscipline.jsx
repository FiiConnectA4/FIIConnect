import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OrarDiscipline = ({ isSecretariat = false }) => {
  const navigate = useNavigate();
  const [discipline, setDiscipline] = useState([]); // Stocăm lista disciplinelor
  const [loading, setLoading] = useState(true); // Indicator de încărcare

  // Funcție pentru a prelua disciplinele din backend
  const fetchDiscipline = async () => {
    try {
      const response = await fetch("http://localhost:34101/orar/discipline"); // Endpoint-ul backend-ului
      if (!response.ok) {
        throw new Error("Eroare la preluarea disciplinelor");
      }
      const data = await response.json();
      console.log("Discipline primite:", data); // Verifică structura datelor
      setDiscipline(data); // Actualizăm lista disciplinelor
    } catch (error) {
      console.error("Eroare:", error);
    } finally {
      setLoading(false); // Dezactivăm indicatorul de încărcare
    }
  };

  // Efect pentru a prelua disciplinele la montarea componentei
  useEffect(() => {
    fetchDiscipline();
  }, []);

  // Funcția de selectare a disciplinei
  const handleDisciplinaSelect = (disciplina) => {
    const basePath = isSecretariat ? "/app/orar-secretariat/discipline" : "/app/orar/discipline";
    navigate(`${basePath}/${disciplina}`);
  };

  if (loading) {
    return <div>Se încarcă lista disciplinelor...</div>; // Afișăm un mesaj de încărcare
  }

  return (
    <div className="orar-discipline-container">
      <div className="orar-buttons">
        {discipline.map((disciplina, index) => (
          <button
            key={index}
            className="orar-button"
            onClick={() => handleDisciplinaSelect(disciplina)}
          >
            {disciplina}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrarDiscipline;
