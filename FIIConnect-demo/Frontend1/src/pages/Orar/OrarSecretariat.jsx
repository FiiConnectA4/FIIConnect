import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import ScheduleTable from "../../components/ScheduleTable/ScheduleTable";
import OrarStudenti from './OrarStudenti';  
import OrarProfesori from './OrarProfesori';  
import OrarDiscipline from './OrarDiscipline';  
import OrarSali from './OrarSali';  
import "./OrarToti.css";

const OrarSecretariat = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { an, grupa, section, profesor, sala, disciplina } = useParams();

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [scheduleData, setScheduleData] = useState([]);
  const [currentSection, setCurrentSection] = useState(section || null);
  const [selectedProfessor, setSelectedProfessor] = useState(profesor || null);
  const [selectedRoom, setSelectedRoom] = useState(sala || null);
  const [selectedDiscipline, setSelectedDiscipline] = useState(disciplina || null);

  const handleSwitchToOrar = () => {
    navigate("/app/orar"); // Navighează la pagina "Orar"
  };

  // Actualizează starea pe baza URL-ului
  useEffect(() => {
    const path = location.pathname;

    if (path.includes("/orar-secretariat/studenti")) {
      setCurrentSection("studenti");
      setSelectedGroup(null);
    } else if (path.includes("/orar-secretariat/profesori")) {
      setCurrentSection("profesori");
      setSelectedProfessor(null);
    } else if (path.includes("/orar-secretariat/sali")) {
      setCurrentSection("sali");
      setSelectedRoom(null);
    } else if (path.includes("/orar-secretariat/discipline")) {
      setCurrentSection("discipline");
      setSelectedDiscipline(null);
    } else {
      setCurrentSection(null);
    }
  }, [location]); 

  useEffect(() => {
    if (an && grupa) {
      const anLabel = `Anul ${an}`;
      setSelectedGroup(`${anLabel} - ${grupa}`);
      setCurrentSection("studenti");

      const url = `http://localhost:34101/orar-secretariat/grupa/${an}/${grupa}`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          setScheduleData(data);
        })
        .catch((err) => {
          console.error("Eroare la preluarea orarului:", err);
        });
    } else if (profesor) {
      const url = `http://localhost:34101/orar-secretariat/profesor/${profesor}`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          setScheduleData(data);
          setSelectedProfessor(profesor);
        })
        .catch((err) => {
          console.error("Eroare la preluarea orarului profesorului:", err);
        });
    } else if (sala) {
      const url = `http://localhost:34101/orar-secretariat/sala/${sala}`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          setScheduleData(data);
          setSelectedRoom(sala);
        })
        .catch((err) => {
          console.error("Eroare la preluarea orarului pentru sală:", err);
        });
    } else if (disciplina) {
      const url = `http://localhost:34101/orar-secretariat/disciplina/${disciplina}`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          setScheduleData(data);
          setSelectedDiscipline(disciplina);
        })
        .catch((err) => {
          console.error("Eroare la preluarea orarului disciplinei:", err);
        });
    }
  }, [an, grupa, profesor, sala, disciplina]);

  const handleRoomClick = (roomName) => {
    setSelectedRoom(roomName);
    navigate(`/app/orar-secretariat/sali/${roomName}`);
  };

  const handleDotariClick = () => {
    if (selectedRoom) {
      navigate(`/app/orar-secretariat/sali/${selectedRoom}/dotari`);
    }
  };

  const handleDisciplineClick = (disciplineName) => {
    setSelectedDiscipline(disciplineName);
    navigate(`/app/orar-secretariat/discipline/${disciplineName}`);
  };

  const handleProfessorClick = (professorName) => {
    setSelectedProfessor(professorName);
    navigate(`/app/orar-secretariat/profesori/${professorName}`);
  };

  const handleBackButtonClick = () => {
    setSelectedGroup(null);
    setSelectedProfessor(null);
    setSelectedRoom(null);
    setSelectedDiscipline(null);
    setScheduleData([]);
    if (currentSection === "studenti") {
      navigate(`/app/orar-secretariat/studenti`);
    } else if (currentSection === "profesori") {
      navigate(`/app/orar-secretariat/profesori`);
    } else if (currentSection === "sali") {
      navigate(`/app/orar-secretariat/sali`);
    } else if (currentSection === "discipline") {
      navigate(`/app/orar-secretariat/discipline`);
    } else {
      navigate(`/app/orar-secretariat`);
    }
  };

  const handleSectionChange = (newSection) => {
    setCurrentSection(newSection);
    navigate(`/app/orar-secretariat/${newSection}`);
  };

  useEffect(() => {
    document.title = `Orar Secretariat - ${selectedGroup || selectedProfessor || selectedRoom || selectedDiscipline || "Alege o categorie"}`;
  }, [selectedGroup, selectedProfessor, selectedRoom, selectedDiscipline]);

  const handleBackToMain = () => {
    if (currentSection === "studenti") {
      navigate(`/app/orar-secretariat`);
    } else if (currentSection === "profesori") {
      navigate(`/app/orar-secretariat`);
    } else if (currentSection === "sali") {
      navigate(`/app/orar-secretariat`);
    } else if (currentSection === "discipline") {
      navigate(`/app/orar-secretariat`);
    } else {
      navigate(`/app/orar-secretariat`);
    }
  };

  return (
    <div className="orar-container">
        <button className="toggle-button" onClick={handleSwitchToOrar}>
        Switch la Orar
      </button>

      {currentSection && (
      <button className="orar-button inapoi" onClick={handleBackToMain}>
        🔙 Înapoi la Orar Secretariat
      </button>
    )}

      {selectedGroup || selectedProfessor || selectedRoom || selectedDiscipline ? (
        <div className="orar-afisat">
          <h3>
            Orar pentru {selectedGroup || (selectedProfessor && `Profesor ${selectedProfessor}`) || (selectedRoom && `Sala ${selectedRoom}`) || (selectedDiscipline && `Disciplina ${selectedDiscipline}`)}
          </h3>
          <ScheduleTable
            schedule={scheduleData}
            title={`Orar pentru ${selectedGroup || `Profesor ${selectedProfessor}` || `Sala ${selectedRoom}` || `Disciplina ${selectedDiscipline}`}`}
            editable={true}  // 👈 aici este modificarea importantă
          />
          <button
            className="orar-button inapoi"
            onClick={handleBackButtonClick}
          >
            🔙 Înapoi
          </button>

          {selectedRoom && (
            <button
              className="orar-button dotari"
              onClick={handleDotariClick}
            >
              Dotări
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="orar-titlu">
            <h1>Orar Secretariat</h1>
            {!currentSection && <h2>Alege o categorie</h2>}
            {currentSection === "studenti" && <h2>Alege anul și grupa</h2>}
          </div>

          {!currentSection && (
            <div className="orar-buttons">
              <button
                className="orar-button"
                onClick={() => handleSectionChange("studenti")}
              >
                🎓 Orar Studenți
              </button>
              <button
                className="orar-button"
                onClick={() => handleSectionChange("profesori")}
              >
                👨‍🏫 Orar Profesori
              </button>
              <button
                className="orar-button"
                onClick={() => handleSectionChange("sali")}
              >
                🏫 Orar Săli
              </button>
              <button
                className="orar-button"
                onClick={() => handleSectionChange("discipline")}
              >
                📚 Orar Discipline
              </button>
            </div>
          )}

          {currentSection === "studenti" && <OrarStudenti />}
          {currentSection === "profesori" && <OrarProfesori onProfessorClick={handleProfessorClick} />}
          {currentSection === "discipline" && <OrarDiscipline onDisciplineClick={handleDisciplineClick} />}
          {currentSection === "sali" && <OrarSali onRoomClick={handleRoomClick} />}
        </>
      )}
    </div>
  );
};

export default OrarSecretariat;
