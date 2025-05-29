import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OrarDiscipline = ({ isSecretariat = false }) => {
  const navigate = useNavigate();
  const [discipline, setDiscipline] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDiscipline = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:34101/orar/discipline", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Eroare la preluarea disciplinelor");
      }
      const data = await response.json();
      console.log("Discipline primite:", data);
      setDiscipline(data);
    } catch (error) {
      console.error("Eroare:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscipline();
  }, []);

  const handleDisciplinaSelect = (disciplinaTitle) => {
    const encodedTitle = encodeURIComponent(disciplinaTitle);
    const basePath = isSecretariat
      ? "/app/orar-secretariat/discipline"
      : "/app/orar/discipline";
    navigate(`${basePath}/${encodedTitle}`);
  };

  if (loading) {
    return <div>Se încarcă lista disciplinelor...</div>;
  }

  return (
    <div className="orar-discipline-container">
      <div className="orar-buttons">
        {discipline.map((disciplina) => (
          <button
            key={disciplina.id}
            className="orar-button"
            onClick={() => handleDisciplinaSelect(disciplina.title)}
          >
            {disciplina.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrarDiscipline;
