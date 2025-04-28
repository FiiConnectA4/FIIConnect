import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ScheduleTable from "../../components/ScheduleTable/ScheduleTable";
import OrarStudenti from './OrarStudenti';  
import OrarProfesori from './OrarProfesori';  
import OrarDiscipline from './OrarDiscipline';  
import OrarSali from './OrarSali';  
import "./OrarToti.css";

const OrarToti = () => {
  const navigate = useNavigate();
  const { an, grupa, section, profesor, sala, disciplina } = useParams(); // Parametrii din URL

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [scheduleData, setScheduleData] = useState([]);
  const [currentSection, setCurrentSection] = useState(section || null);
  const [selectedProfessor, setSelectedProfessor] = useState(profesor || null);
  const [selectedRoom, setSelectedRoom] = useState(sala || null);
  const [selectedDiscipline, setSelectedDiscipline] = useState(disciplina || null);

  // Se actualizează dacă an, grupa, profesor, sală sau disciplină sunt disponibile
  useEffect(() => {
    if (an && grupa) {
      const anLabel = `Anul ${an}`;
      setSelectedGroup(`${anLabel} - ${grupa}`);
      setCurrentSection("studenti");

      const url = `http://localhost:34101/orar/grupa/${an}/${grupa}`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          setScheduleData(data);
        })
        .catch((err) => {
          console.error("Eroare la preluarea orarului:", err);
        });
    } else if (profesor) {
      const url = `http://localhost:34101/orar/profesor/${profesor}`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          setScheduleData(data); // Setează datele primite
          setSelectedProfessor(profesor); // Setează profesorul selectat
        })
        .catch((err) => {
          console.error("Eroare la preluarea orarului profesorului:", err);
        });
    } else  if (sala) {
      const url = `http://localhost:34101/orar/sala/${sala}`; // URL-ul va conține doar sala
      fetch(url)
          .then((res) => res.json())
          .then((data) => {
              setScheduleData(data); // Setează datele primite în stare
              setSelectedRoom(sala);  // Setează numele sălii selectate
          })
          .catch((err) => {
              console.error("Eroare la preluarea orarului pentru sală:", err);
          });
    } else if (disciplina) {
      const url = `http://localhost:34101/orar/disciplina/${disciplina}`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          setScheduleData(data); // Setează datele primite
          setSelectedDiscipline(disciplina); // Setează disciplina selectată
        })
        .catch((err) => {
          console.error("Eroare la preluarea orarului disciplinei:", err);
        });
    }
  }, [an, grupa, profesor, sala, disciplina]);

  // Functii pentru selectarea elementelor
  const handleRoomClick = (roomName) => {
    setSelectedRoom(roomName);
    navigate(`/app/orar/sali/${roomName}`); // Navighează doar la ruta sălii
};

const handleDotariClick = () => {
  if (selectedRoom) {
    navigate(`/app/orar/sali/${selectedRoom}/dotari`); // Navighează la pagina dotărilor pentru sala selectată
  }
};


const handleDisciplineClick = (disciplineName) => {
  setSelectedDiscipline(disciplineName); // Actualizează starea pentru disciplina selectată
  navigate(`/app/orar/discipline/${disciplineName}`); // Navighează la URL-ul disciplinei
};

  const handleProfessorClick = (professorName) => {
    setSelectedProfessor(professorName);
    navigate(`/app/orar/profesori/${professorName}`); // Actualizează URL-ul cu numele profesorului
    const url = `http://localhost:34101/orar/profesor/${professorName}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setScheduleData(data);
      })
      .catch((err) => {
        console.error("Eroare la preluarea orarului profesorului:", err);
      });
  };

  const handleBackButtonClick = () => {
    // Mergi înapoi la secțiunea generală (studenti, profesori, etc.)
    setSelectedGroup(null);
    setSelectedProfessor(null);
    setSelectedRoom(null);
    setSelectedDiscipline(null);
    setScheduleData([]);
    if (currentSection === "studenti") {
      navigate(`/app/orar/studenti`);
    } else if (currentSection === "profesori") {
      navigate(`/app/orar/profesori`);
    } else if (currentSection === "sali") {
      navigate(`/app/orar/sali`);
    } else if (currentSection === "discipline") {
      navigate(`/app/orar/discipline`);
    } else {
      navigate(`/app/orar`);
    }
  };

  const handleSectionChange = (newSection) => {
    setCurrentSection(newSection);
    navigate(`/app/orar/${newSection}`);
  };

  // Actualizează titlul paginii în funcție de selecția curentă
  useEffect(() => {
    document.title = `Orar - ${selectedGroup || selectedProfessor || selectedRoom || selectedDiscipline || "Alege o categorie"}`;
  }, [selectedGroup, selectedProfessor, selectedRoom, selectedDiscipline]);

  return (
    <div className="orar-container">
      {selectedGroup || selectedProfessor || selectedRoom || selectedDiscipline ? (
        <div className="orar-afisat">
          <h3>
          <h3>
  Orar pentru {selectedGroup || (selectedProfessor && `Profesor ${selectedProfessor}`) || (selectedRoom && `Sala ${selectedRoom}`) || (selectedDiscipline && `Disciplina ${selectedDiscipline}`) || "Selectează o categorie"}
</h3>
          </h3>
          <ScheduleTable
            schedule={scheduleData}
            title={`Orar pentru ${selectedGroup || `Profesor ${selectedProfessor}` || `Sala ${selectedRoom}` || `Disciplina ${selectedDiscipline}`}`}
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
            <h1>Orar</h1>
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
          {currentSection === "profesori" && (
            <OrarProfesori onProfessorClick={handleProfessorClick} />
          )}
          {currentSection === "discipline" && (
            <OrarDiscipline onDisciplineClick={handleDisciplineClick} />
          )}
          {currentSection === "sali" && (
            <OrarSali onRoomClick={handleRoomClick} />
          )}
        </>
      )}
    </div>
  );
};

export default OrarToti;
