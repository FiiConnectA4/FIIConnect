import React, { useState, useRef, useEffect } from "react";
import "./OrarToti.css";

const OrarToti = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const dropdownRefs = useRef([]);

  const toggleDropdown = (index, e) => {
    e.stopPropagation(); // Previne închiderea imediată
    setActiveDropdown((prev) => (prev === index ? null : index));
    setSelectedOption(null); // Resetăm opțiunea selectată când schimbăm dropdownul
    setSelectedGroup(null);
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRefs.current.every(
        (ref) => ref && !ref.contains(event.target)
      )
    ) {
      setActiveDropdown(null);
      setSelectedOption(null);
      setSelectedGroup(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const buttons = [
    {
      label: "Orar studenți",
      icon: "🎓",
      options: ["Anul 1", "Anul 2", "Anul 3", "Master 1", "Master 2", "Școala doctorală"],
    },
    {
      label: "Orar profesori",
      icon: "👨‍🏫",
      options: ["Profesor 1", "Profesor 2", "Profesor 3"],
    },
    {
      label: "Orar pe discipline de studiu",
      icon: "📘",
      options: ["Disciplină 1", "Disciplină 2", "Disciplină 3"],
    },
    {
      label: "Orar săli și alte resurse",
      icon: "🏢",
      options: ["Sala 1", "Sala 2", "Sala 3"],
    },
  ];

  return (
    <div className="orar-container">
      <div className="orar-titlu">
        <h1>Orar</h1>
        <h2>Alege o categorie pentru a vizualiza detalii</h2>
      </div>
      <div className="orar-buttons">
        {buttons.map((button, index) => (
          <div
            className="dropdown-container"
            key={index}
            ref={(el) => (dropdownRefs.current[index] = el)}
          >
            <button
              className="orar-button"
              onClick={(e) => toggleDropdown(index, e)}
            >
              <span className="icon">{button.icon}</span>
              {button.label}
            </button>

            {activeDropdown === index && (
              <div className="dropdown-menu">
                {button.options.map((option, i) => (
                  <div key={i}>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setSelectedOption(option);
                        setSelectedGroup(null);
                      }}
                    >
                      {option}
                    </button>

                    {/* Dacă a fost selectat un an, afișează grupele */}
                    {selectedOption === option &&
                      option.toLowerCase().includes("anul") && (
                        <div className="group-menu">
                          {Array.from({ length: 15 }).map((_, gIndex) => (
                            <button
                              key={gIndex}
                              className="dropdown-item"
                              onClick={() =>
                                setSelectedGroup(`Grupa ${gIndex + 1}`)
                              }
                            >
                              Grupa {gIndex + 1}
                            </button>
                          ))}
                        </div>
                      )}
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

export default OrarToti;
