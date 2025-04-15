import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ScheduleTable from "../../components/ScheduleTable/ScheduleTable";
import "./OrarToti.css";
// La partea cu selectarea oralului pe baza salii am reusit dar nu cu foreign key(am incercat nu mai aparea orarul deloc) pentru a prelua orarul pe baza salii este asemanator cum preiei pe baza grupei.
// Deci pentru a naviga pe pagina cu obiectele care se petrec intr-o anumita sala url arata asa : http://localhost:34101/orar/sala/C2 (eu am definit C2 in propria baza).
// Am implementat pentru sala obtiunea de a obtine sala pe baza numelui(acesta afiseaza pe baza SalaDTO) si id(aceasta afiseaza tot despre sala).(Ca sa verifici folosesti la prima un get pe postman la adresa: http://localhost:34101/sali/nume/C2 si pe baza id-ului la adresa  : http://localhost:34101/sali/id/2).
// Noi nu am implematat nicio partea a frontului.
const OrarToti = () => {
  const navigate = useNavigate();
  const { an, grupa } = useParams();

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [section, setSection] = useState(null);
  const [scheduleData, setScheduleData] = useState([]);
  const dropdownRefs = useRef([]);

<<<<<<< HEAD
=======
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
  setActiveDropdown(null); // închide dropdownul
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

>>>>>>> 72f2310f0 (finalmerge)
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

<<<<<<< HEAD
=======
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
  

>>>>>>> 72f2310f0 (finalmerge)
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
<<<<<<< HEAD
          <ScheduleTable schedule={scheduleData} title={`Orar pentru ${selectedGroup}`} />
=======
          <ScheduleTable
  schedule={scheduleData}
  title={`Orar pentru ${selectedGroup}`}
  showSala={true}
/>

>>>>>>> 72f2310f0 (finalmerge)
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
<<<<<<< HEAD
        </>
      )}
=======
{section === "sali" && !selectedGroup && (
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
                <div key={i}>
                  <button className="dropdown-item" onClick={() => handleSalaSelect(sala)}>
                    {sala}
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


{section === "sali" && sali.length > 0 && !selectedGroup && (
  <div className="orar-buttons">
    {sali.map((sala, index) => (
      <button
        key={index}
        className="orar-button"
        onClick={() => handleSalaSelect(sala.nume)}
      >
        🧾 {sala.nume}
      </button>
    ))}
  </div>
)}

{section === "sali" && selectedGroup && (
  <div className="orar-afisat">
    <h3>Orar pentru sala {selectedGroup}</h3>
    <ScheduleTable
  schedule={scheduleData}
  title={`Orar pentru sala ${selectedGroup}`}
  showSala={false}
/>

    <button className="orar-button" onClick={handleShowDotari}>
      📦 Afișează dotări
    </button>

    {dotariSala && (
      <div className="dotari-box">
        <p><strong>Dotări:</strong> {dotariSala.dotari}</p>
        <p><strong>Capacitate:</strong> {dotariSala.capacitate}</p>
        <p><strong>Tip:</strong> {dotariSala.tipSala}</p>
        <p><strong>Locație:</strong> {dotariSala.locatie}</p>
        <p><strong>Observații:</strong> {dotariSala.observatii}</p>
      </div>
    )}

    <button
      className="orar-button inapoi"
      onClick={() => {
        setSelectedGroup(null);
        setScheduleData([]);
        setDotariSala(null);
      }}
    >
      🔙 Înapoi la etaje
    </button>
  </div>
)}


          
        </>
      )}
    

>>>>>>> 72f2310f0 (finalmerge)
    </div>
  );
};

export default OrarToti;
