import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";


const OrarStudenti = () => {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRefs = useRef([]);

  const buttons = [
    {
      label: "Anul 1",
      icon: "1️⃣",
      options: ["A1", "A2", "A3", "A4", "A5", "B1", "B2", "B3", "B4", "E1", "E2", "E3", "I1X1", "I1X2", "I1X3", "I1X4"],
    },
    {
      label: "Anul 2",
      icon: "2️⃣",
      options: ["A1", "A2", "A3", "A4", "A5", "B1", "B2", "B3", "B4", "E1", "E2", "E3", "I1X1", "I1X2", "I1X3", "I1X4"],
    },
    {
      label: "Anul 3",
      icon: "3️⃣",
      options: ["A1", "A2", "A3", "A4", "A5", "B1", "B2", "B3", "B4", "E1", "E2", "E3", "X"],
    },
    {
      label: "Master Anul 1",
      icon: "🎓",
      options: [
        "Inteligența Artificială și Optimizare",
        "Ingineria Sistemelor Soft",
        "Lingvistica Computațională",
        "Studii Avansate în Informatică",
        "Sisteme Distribuite",
        "Securitatea Informațiilor",
      ],
    },
    {
      label: "Master Anul 2",
      icon: "🎓",
      options: [
        "Inteligența Artificială și Optimizare",
        "Ingineria Sistemelor Soft",
        "Lingvistica Computațională",
        "Studii Avansate în Informatică",
        "Sisteme Distribuite",
        "Securitatea Informațiilor",
      ],
    },
  ];

  const toggleDropdown = (index, e) => {
    e.stopPropagation();
    setActiveDropdown((prev) => (prev === index ? null : index));
  };

  const handleGroupSelect = (anLabel, grupa) => {
    const anNumber = anLabel.replace("Anul ", "").trim();
    navigate(`/app/orar/studenti/${anNumber}/${grupa}`);
  };

  return (
    <div className="orar-studenti-container">
      <div className="orar-buttons">
        {buttons.map((button, index) => (
          <div className="dropdown-container" key={index} ref={(el) => (dropdownRefs.current[index] = el)}>
            <button className="orar-button" onClick={(e) => toggleDropdown(index, e)}>
              <span className="icon">{button.icon}</span>
              {button.label}
            </button>

            {activeDropdown === index && (
              <div className="dropdown-menu">
                {button.options.map((option, i) => (
                  <div key={i}>
                    <button
                      className="dropdown-item"
                      onClick={() => handleGroupSelect(button.label, option)}
                    >
                      {option}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrarStudenti;
