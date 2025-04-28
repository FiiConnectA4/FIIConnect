import React, { useState, useRef } from "react";

const OrarProfesori = ({ onProfessorClick }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRefs = useRef([]);

  // Listă cu profesori
  const profesori = [
    "Lenuta Alboaie",
    "Vasilescu Andrei",
    "Ion Popescu",
    "Maria Ionescu", // Poți adăuga mai mulți profesori
  ];

  const toggleDropdown = (index, e) => {
    e.stopPropagation();
    setActiveDropdown((prev) => (prev === index ? null : index));
  };

  const handleProfesorSelect = (profesor) => {
    onProfessorClick(profesor); // Apelează funcția din props pentru a seta profesorul selectat
  };

  return (
    <div className="orar-profesori-container">
      <div className="orar-buttons">
        {profesori.map((profesor, index) => (
          <div
            className="dropdown-container"
            key={index}
            ref={(el) => (dropdownRefs.current[index] = el)}
          >
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