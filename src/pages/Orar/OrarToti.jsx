import React, { useState, useRef, useEffect } from "react";
import "./OrarToti.css";

const OrarToti = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null); // Adăugat pentru anul selectat
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedProfesor, setSelectedProfesor] = useState(null); // Adăugat pentru profesorul selectat
  const [orarGrupa, setOrarGrupa] = useState([]);
  const [orarProfesor, setOrarProfesor] = useState([]); // Adăugat pentru orarul profesorului
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRefs = useRef([]);

  const toggleDropdown = (index, e) => {
    e.stopPropagation();
    setActiveDropdown((prev) => (prev === index ? null : index));
    setSelectedOption(null);
    setSelectedYear(null); // Resetează anul când comută dropdown-ul
    setSelectedGroup(null);
    setOrarGrupa([]);
    setSelectedProfesor(null); // Resetăm profesorul
    setOrarProfesor([]); // Resetăm orarul profesorului
  };

  // Funcția pentru a prelua orarul grupei
  const fetchOrarGrupa = async (grupa) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:34101/orar/grupa/${encodeURIComponent(grupa)}`);
      if (!response.ok) {
        throw new Error('Eroare la fetch');
      }
      const data = await response.json();
      setOrarGrupa(data);
    } catch (err) {
      setError('Eroare la fetch');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Funcția pentru a prelua orarul profesorului
  const fetchOrarProfesor = async (profesor) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:34101/orar/profesor/${encodeURIComponent(profesor)}`);
      if (!response.ok) {
        throw new Error('Eroare la fetch');
      }
      const data = await response.json();
      setOrarProfesor(data);
    } catch (err) {
      setError('Eroare la fetch');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRefs.current.every((ref) => ref && !ref.contains(event.target))) {
      setActiveDropdown(null);
      setSelectedOption(null);
      setSelectedYear(null); // Resetează anul și grupa
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

  // Butoanele și opțiunile de selecție
  const buttons = [
    {
      label: "Orar studenți",
      icon: "🎓",
      options: ["Anul 1", "Anul 2", "Anul 3", "Master 1", "Master 2", "Școala doctorală"],
    },
    {
      label: "Orar profesori",
      icon: "👨‍🏫",
      options: ["Vasilescu Andrei", "Profesor 2", "Profesor 3"], // Poți modifica aceasta listă pentru a include profesori reali
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
                        setSelectedYear(null); // Resetăm anul când schimbăm opțiunea
                        setSelectedGroup(null);
                        setOrarGrupa([]);
                        setSelectedProfesor(option); // Setăm profesorul selectat
                        setOrarProfesor([]); // Resetăm orarul profesorului
                        fetchOrarProfesor(option); // Fetch orarul pentru profesor
                      }}
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

      {/* Afișăm orarul grupei doar dacă s-a selectat o grupă */}
      {selectedGroup && (
        <div className="orar-afisat">
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

      {/* Afișăm orarul profesorului doar dacă s-a selectat un profesor */}
      {selectedProfesor && (
        <div className="orar-afisat">
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
