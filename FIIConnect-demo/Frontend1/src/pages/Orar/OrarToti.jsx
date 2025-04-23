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

  const [sali, setSali] = useState([]);
  const [dotariSala, setDotariSala] = useState(null);

  const handleEtajSelect = (etaj) => {
    fetch(`http://localhost:34101/sali/etaj/${etaj}`)
      .then((res) => res.json())
      .then((data) => setSali(data))
      .catch((err) => console.error("Eroare la preluarea sălilor:", err));
  };

  const handleSalaSelect = (numeSala) => {
    setSelectedGroup(numeSala);
    setActiveDropdown(null);
    setSection("sali"); // <- adăugat!
    fetch(`http://localhost:34101/orar/sala/${numeSala}`)
      .then((res) => res.json())
      .then((data) => setScheduleData(data))
      .catch((err) => console.error("Eroare la orar sala:", err));
  };
  
  const handleShowDotari = () => {
    fetch(`http://localhost:34101/sali/nume/${selectedGroup}`)
      .then((res) => res.json())
      .then((data) => setDotariSala(data[0]))
      .catch((err) => console.error("Eroare la dotări:", err));
  };

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

  useEffect(() => {
    if (an && grupa) {
      const anLabel = `Anul ${an}`;
      setSelectedGroup(`${anLabel} - ${grupa}`);
      setSection("studenti");

      const url = `http://localhost:34101/orar/grupa/${an}/${grupa}`;
      fetch(url)
        .then((res) => res.json())
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
      options: ["A1", "A2", "A3", "A4", "A5", "B1", "B2", "B3", "B4", "E1", "E2", "E3", "X"]
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

  const etaje = [
    {
      label: "Parter",
      icon: "🏢",
      sali: ["C2", "C112", "C210"],
    },
    {
      label: "Etaj 1",
      icon: "🧱",
      sali: ["C308", "C309"],
    },
    {
      label: "Etaj 2",
      icon: "🏬",
      sali: ["C401", "C403", "C405", "C409", "C411", "C412", "C413"],
    },
    {
      label: "Etaj 7",
      icon: "🌇",
      sali: ["C901", "C903"],
    },
  ];

  const handleGroupSelect = (anLabel, grupa) => {
    const anNumber = anLabel.replace("Anul ", "").trim();
    navigate(`/app/orar/studenti/${anNumber}/${grupa}`);
  };

  // Funcție pentru selectarea unui profesor
  const handleProfesorSelect = (profesor) => {
    setSelectedGroup(profesor);
    setActiveDropdown(null);
    fetch(`http://localhost:34101/orar/profesor/${profesor}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Date pentru profesor:", data); // Verifică datele primite
        setScheduleData(data);
      })
      .catch((err) => console.error("Eroare la orar profesor:", err));
  };
  

  // Funcție pentru selectarea unei discipline
  const handleDisciplinaSelect = (disciplina) => {
    setSelectedGroup(disciplina);
    setActiveDropdown(null);
    fetch(`http://localhost:34101/orar/disciplina/${disciplina}`)
      .then((res) => res.json())
      .then((data) => setScheduleData(data))
      .catch((err) => console.error("Eroare la orar disciplina:", err));
  };

  return (
    <div className="orar-container">
      {selectedGroup ? (
        <div className="orar-afisat">
          <h3>Orar pentru {selectedGroup}</h3>
          <ScheduleTable
  schedule={scheduleData}
  title={`Orar pentru ${selectedGroup}`}
  showSala={section !== "sali"} // afișează coloana "Sală" DOAR dacă nu e orar pentru săli
/>

          <button
            className="orar-button inapoi"
            onClick={() => {
              setSelectedGroup(null);
              setScheduleData([]);
              navigate("/app/orar");
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

{section === "profesori" && (
  <>
    <div className="orar-buttons">
      <button className="orar-button" onClick={() => handleProfesorSelect("Lenuta Alboaie")}>
        Lenuta Alboaie
      </button>
      <button className="orar-button" onClick={() => handleProfesorSelect("Vasilescu Andrei")}>
        Vasilescu Andrei
      </button>
    </div>
    <div className="inapoi-container">
      <button
        className="orar-button inapoi"
        onClick={() => {
          setSection(null);
          navigate("/app/orar");
        }}
      >
        🔙 Înapoi
      </button>
    </div>
  </>
)}


{section === "discipline" && (
  <>
    <div className="orar-buttons">
      <button className="orar-button" onClick={() => handleDisciplinaSelect("Algoritmica grafurilor")}>
        Algoritmica Grafurilor
      </button>
    </div>
    <div className="inapoi-container">
      <button
        className="orar-button inapoi"
        onClick={() => {
          setSection(null);
          navigate("/app/orar");
        }}
      >
        🔙 Înapoi
      </button>
    </div>
  </>
)}

{section === "sali" && (
  <>
    <div className="orar-buttons">
      {etaje.map((etaj, index) => (
        <div
          className="dropdown-container"
          key={index}
          ref={(el) => (dropdownRefs.current[index] = el)}
        >
          <button className="orar-button" onClick={(e) => toggleDropdown(index, e)}>
            <span className="icon">{etaj.icon}</span>
            {etaj.label}
          </button>

          {activeDropdown === index && (
            <div className="dropdown-menu">
              {etaj.sali.map((sala, i) => (
                <button
                  className="dropdown-item"
                  key={i}
                  onClick={() => handleSalaSelect(sala)}
                >
                  {sala}
                </button>
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
