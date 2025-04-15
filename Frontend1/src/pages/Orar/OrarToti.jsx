import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ScheduleTable from "../../components/ScheduleTable/ScheduleTable";
import "./OrarToti.css";

const OrarToti = () => {
  const navigate = useNavigate();
  const { an, grupa } = useParams();

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [section, setSection] = useState(null);
  const [scheduleData, setScheduleData] = useState([]);
  const dropdownRefs = useRef([]);

  const toggleDropdown = (index, e) => {
    e.stopPropagation();
    setActiveDropdown((prev) => (prev === index ? null : index));
    setSelectedGroup(null);
  };

  const handleClickOutside = (event) => {
    if (dropdownRefs.current.every((ref) => ref && !ref.contains(event.target))) {
      setActiveDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // dacă vin parametri din URL, aduce orarul
  useEffect(() => {
    if (an && grupa) {
      const anLabel = `Anul ${an}`;
      setSelectedGroup(`${anLabel} - ${grupa}`);
      setSection("studenti");

      const url = `http://localhost:34101/orar/grupa/${an}/${grupa}`;
      fetch(url)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Eroare la fetch orar. Status: " + res.status);
          }
          return res.json();
        })
        .then((data) => {
          setScheduleData(data);
        })
        .catch((err) => {
          console.error("Eroare la preluarea orarului:", err);
        });
    }
  }, [an, grupa]);

  const buttons = [
    {
      label: "Anul 1",
      icon: "1️⃣",
      options: ["A1", "A2", "A3", "A4", "A5", "B1", "B2", "B3", "B4", "B5", "E1", "E2", "E3"],
    },
    {
      label: "Anul 2",
      icon: "2️⃣",
      options: ["A1", "A2", "A3", "A4", "A5", "B1", "B2", "B3", "B4", "B5", "E1", "E2", "E3"],
    },
    {
      label: "Anul 3",
      icon: "3️⃣",
      options: ["A1", "A2", "A3", "A4", "A5", "B1", "B2", "B3", "B4", "B5", "E1", "E2", "E3"],
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

  const handleGroupSelect = (anLabel, grupa) => {
    const anNumber = anLabel.replace("Anul ", "").trim();
    // Navighează la URL-ul cu an și grupă selectate
    navigate(`/app/orar/studenti/${anNumber}/${grupa}`);
  };

  return (
    <div className="orar-container">
      {selectedGroup ? (
        <div className="orar-afisat">
          <h3>Orar pentru {selectedGroup}</h3>
          <ScheduleTable schedule={scheduleData} title={`Orar pentru ${selectedGroup}`} />
          <button
            className="orar-button inapoi"
            onClick={() => {
              setSelectedGroup(null);
              setScheduleData([]);
              navigate("/app/orar"); // Navighează înapoi la secțiunea "orar"
            }}
          >
            🔙 Înapoi
          </button>
        </div>
      ) : (
        <>
          <div className="orar-titlu">
            <h1>Orar</h1>
            {!section && <h2>Alege o categorie</h2>}
            {section === "studenti" && <h2>Alege anul și grupa</h2>}
          </div>

          {!section && (
            <div className="orar-buttons">
              <button className="orar-button" onClick={() => setSection("studenti")}>
                🎓 Orar Studenți
              </button>
              <button className="orar-button" onClick={() => setSection("profesori")}>
                👨‍🏫 Orar Profesori
              </button>
              <button className="orar-button" onClick={() => setSection("sali")}>
                🏫 Orar Săli
              </button>
              <button className="orar-button" onClick={() => setSection("discipline")}>
                📚 Orar Discipline
              </button>
            </div>
          )}

          {section === "studenti" && (
            <>
              <div className="orar-buttons">
                {buttons.map((button, index) => (
                  <div
                    className="dropdown-container"
                    key={index}
                    ref={(el) => (dropdownRefs.current[index] = el)}
                  >
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

              <div className="inapoi-container">
                <button
                  className="orar-button inapoi"
                  onClick={() => {
                    setSection(null);
                    setActiveDropdown(null);
                    navigate("/app/orar");
                  }}
                >
                  🔙 Înapoi
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default OrarToti;
