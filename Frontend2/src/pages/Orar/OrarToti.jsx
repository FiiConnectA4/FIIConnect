import React, { useState, useRef, useEffect } from "react";
import "./OrarToti.css";

const OrarToti = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedProfesor, setSelectedProfesor] = useState(null);
  const [orarGrupa, setOrarGrupa] = useState([]);
  const [orarProfesor, setOrarProfesor] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRefs = useRef([]);
  const [salaSelectata, setSalaSelectata] = useState(null);
  const [detaliiSala, setDetaliiSala] = useState(null);

  const profesori = ["Vasilescu Andrei", "Drăghici Ioana", "Rusu Cristina"];

  const grupePeAn = {
    "Anul 1": ["Grupa A1", "Grupa A2", "Grupa A3", "Grupa A4", "Grupa A5", "Grupa B1", "Grupa B2", "Grupa B3", "Grupa B4", "Grupa E1", "Grupa E2", "Grupa E3", "Grupa X1", "Grupa X2", "Grupa X3", "Grupa X4"],
    "Anul 2": ["Grupa A1", "Grupa A2", "Grupa A3", "Grupa A4", "Grupa A5", "Grupa B1", "Grupa B2", "Grupa B3", "Grupa B4", "Grupa E1", "Grupa E2", "Grupa E3", "Grupa X1", "Grupa X2", "Grupa X3", "Grupa X4"],
    "Anul 3": ["Grupa A1", "Grupa A2", "Grupa A3", "Grupa A4", "Grupa A5", "Grupa B1", "Grupa B2", "Grupa B3", "Grupa B4", "Grupa E1", "Grupa E2", "Grupa E3", "Grupa X"],
    "Master" : {"Inteligență artificială și optimizare" : ["Anul 1","Anul 2"],"Ingineria sistemelor soft" : {"Anul 1":["Grupa 1","Grupa 2"], "Anul 2":["Grupa 1","Grupa 2"]},"Lingvistică computațională" : ["Anul 1","Anul 2"],"Studii avansate in informatică" : ["Anul 1","Anul 2"],"Sisteme distribuite" : ["Anul 1","Anul 2"],"Securitatea informatiei" : ["Anul 1","Anul 2"]},
    "Școala doctorală": ["Grupa Doc-1"]
  };

  const toggleDropdown = (index, e) => {
    e.stopPropagation();
    setActiveDropdown((prev) => (prev === index ? null : index));
    setSelectedOption(null);
    setSelectedYear(null);
    setSelectedGroup(null);
    setOrarGrupa([]);
    setSelectedProfesor(null);
    setOrarProfesor([]);
  };

  const handleSelectOption = (option) => {
    setSelectedOption(option);
  
    if (profesori.includes(option)) {
      setSelectedProfesor(option);
      fetchOrarProfesor(option);
    } else if (option === "Master") {
      setSelectedYear("Master");
    } else if (grupePeAn[option]) {
      setSelectedYear(option);
    } else if (
      selectedYear === "Master" &&
      typeof grupePeAn["Master"][selectedOption] === "object" &&
      grupePeAn["Master"][selectedOption][option]
    ) {
      setSelectedGroup(option);
    } else if (selectedYear && grupePeAn[selectedYear]?.includes(option)) {
      setSelectedGroup(option);
      fetchOrarGrupa(option);
    } else {
      fetchSalaInfo(option);
    }
  };
  const fetchSalaInfo = async (numeSala) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:34101/sali/${encodeURIComponent(numeSala)}`);
      const data = await res.json();
      setDetaliiSala(data);
      setSalaSelectata(numeSala);
    } catch (err) {
      setError("Nu s-au putut prelua datele despre sală");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrarGrupa = async (grupa) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:34101/orar/grupa/${encodeURIComponent(selectedYear)}/${encodeURIComponent(grupa)}`
      );
      if (!response.ok) throw new Error("Eroare la fetch");
      const data = await response.json();
      setOrarGrupa(data);
    } catch (err) {
      setError("Eroare la fetch");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrarProfesor = async (profesor) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:34101/orar/profesor/${encodeURIComponent(profesor)}`
      );
      if (!response.ok) throw new Error("Eroare la fetch");
      const data = await response.json();
      setOrarProfesor(data);
    } catch (err) {
      setError("Eroare la fetch");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRefs.current.every((ref) => ref && !ref.contains(event.target))) {
      setActiveDropdown(null);
      setSelectedOption(null);
      setSelectedYear(null);
      setSelectedGroup(null);
      setOrarGrupa([]);
      setSelectedProfesor(null);
      setOrarProfesor([]);
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
      options: Object.keys(grupePeAn),
    },
    {
      label: "Orar profesori",
      icon: "👨‍🏫",
      options: profesori,
    },
    {
      label: "Orar pe discipline de studiu",
      icon: "📘",
      options: ["Disciplină 1", "Disciplină 2", "Disciplină 3"],
    },
    {
      label: "Orar săli și alte resurse",
      icon: "🏢",
      options: ["C101", "Sala 2", "Sala 3"],
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
                  <div key={i} className="dropdown-item-wrapper">
                    <button
                      className="dropdown-item"
                      onClick={() => handleSelectOption(option)}
                    >
                      {option}
                    </button>

                    {/* Sub-dropdown cu grupele */}
                    {selectedYear === option && grupePeAn[option] && (
                      <div className="group-menu">
                        {grupePeAn[option].map((grupa, j) => (
                          <button
                            key={j}
                            className="dropdown-item"
                            onClick={() => handleSelectOption(grupa)}
                          >
                            {grupa}
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
      
      {/* Orar pentru grupă */}
      {selectedGroup && (
        <div className="orar-afisat orar-output">
          <h3>Orar pentru {selectedGroup}</h3>
          {loading && <p>Se încarcă...</p>}
          {error && <p>{error}</p>}
          {orarGrupa.length === 0 ? (
            <p>Nu există orar pentru această grupă.</p>
          ) : (
            <ul>
              {orarGrupa.map((ora, index) => (
                <li key={index}>
                  {ora.zi}, {ora.oraStart} - {ora.oraEnd} @ {ora.sala} (
                  {ora.disciplina}) - {ora.profesor}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      
      {/* Orar pentru profesor */}
      {selectedProfesor && (
        <div className="orar-afisat orar-output">
          <h3>Orar pentru {selectedProfesor}</h3>
          {loading && <p>Se încarcă...</p>}
          {error && <p>{error}</p>}
          {orarProfesor.length === 0 ? (
            <p>Nu există orar pentru acest profesor.</p>
          ) : (
            <ul>
              {orarProfesor.map((ora, index) => (
                <li key={index}>
                  {ora.zi}, {ora.oraStart} - {ora.oraEnd} @ {ora.sala} (
                  {ora.disciplina}) - {ora.profesor}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default OrarToti;
