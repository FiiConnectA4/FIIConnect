import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const OrarDiscipline = ({ isSecretariat = false }) => {
  const navigate = useNavigate();

  // Listă cu discipline
  const discipline = [
    "Algoritmica Grafurilor",
    "Programare Orientată pe Obiecte",
    "Sisteme de Operare",
    "Structuri de Date",
    "Teoria Limbajelor Formale",
    "Algoritmi Avansați",
    "Baze de Date",
  ];

  // Functia de selectare a disciplinei
  const handleDisciplinaSelect = (disciplina) => {
    const basePath = isSecretariat ? "/app/orar-secretariat/discipline" : "/app/orar/discipline";
    navigate(`${basePath}/${disciplina}`);
  };

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
