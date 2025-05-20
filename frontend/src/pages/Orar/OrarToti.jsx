import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import ScheduleTable from "../../components/ScheduleTable/ScheduleTable";
import OrarStudenti from './OrarStudenti';
import OrarProfesori from './OrarProfesori';
import OrarDiscipline from './OrarDiscipline';
import OrarSali from './OrarSali';
import "./OrarToti.css";

const OrarToti = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { an, grupa, section, profesor, sala, disciplina } = useParams(); // Parametrii din URL

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [scheduleData, setScheduleData] = useState([]);
  const [currentSection, setCurrentSection] = useState(section || null);
  const [selectedProfessor, setSelectedProfessor] = useState(profesor || null);
  const [selectedRoom, setSelectedRoom] = useState(sala || null);
  const [selectedDiscipline, setSelectedDiscipline] = useState(disciplina || null);

  const handleSwitchToSecretariat = () => {
    navigate("/app/orar-secretariat"); // Navighează la pagina "OrarSecretariat"
  };

  useEffect(() => {
    const path = location.pathname;

    if (path.includes("/orar/studenti")) {
      setCurrentSection("studenti");
      setSelectedGroup(null);
    } else if (path.includes("/orar/profesori")) {
      setCurrentSection("profesori");
      setSelectedProfessor(null);
    } else if (path.includes("/orar/sali")) {
      setCurrentSection("sali");
      setSelectedRoom(null);
    } else if (path.includes("/orar/discipline")) {
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

      const url = `http://localhost:34101/orar/studenti/${an}/${grupa}`;
      const token = localStorage.getItem("token");
      fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
          .then((res) => res.json())
          .then((data) => {
            console.log('Răspuns API pentru grupă:', data); // Verificăm ce răspuns primim

            if (Array.isArray(data)) {
              setScheduleData(data);
            } else if (data && data.schedule && Array.isArray(data.schedule)) {
              setScheduleData(data.schedule); // Dacă datele sunt într-un câmp `schedule`, le extragem
            } else {
              console.error("Datele primite nu sunt un array valid:", data);
              setScheduleData([]);
            }
          })
          .catch((err) => {
            console.error("Eroare la preluarea orarului:", err);
          });
    } else if (profesor) {
      const url = `http://localhost:34101/orar/profesor/${profesor}`;
      fetch(url, {
          headers: {
              'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
      })
          .then((res) => res.json())
          .then((data) => {
            console.log('Răspuns API pentru profesor:', data); // Verificăm ce răspuns primim

            if (Array.isArray(data)) {
              setScheduleData(data);
            } else if (data && data.schedule && Array.isArray(data.schedule)) {
              setScheduleData(data.schedule);
            } else {
              console.error("Datele primite nu sunt un array valid:", data);
              setScheduleData([]);
            }
            setSelectedProfessor(profesor);
          })
          .catch((err) => {
            console.error("Eroare la preluarea orarului profesorului:", err);
          });
    } else if (sala) {
      const url = `http://localhost:34101/orar/sala/${sala}`;
      fetch(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
      })
          .then((res) => res.json())
          .then((data) => {
            console.log('Răspuns API pentru sală:', data); // Verificăm ce răspuns primim

            if (Array.isArray(data)) {
              setScheduleData(data);
            } else if (data && data.schedule && Array.isArray(data.schedule)) {
              setScheduleData(data.schedule);
            } else {
              console.error("Datele primite nu sunt un array valid:", data);
              setScheduleData([]);
            }
            setSelectedRoom(sala);
          })
          .catch((err) => {
            console.error("Eroare la preluarea orarului pentru sală:", err);
          });
    } else if (disciplina) {
      const url = `http://localhost:34101/orar/disciplina/${disciplina}`;
      fetch(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
      })
          .then((res) => res.json())
          .then((data) => {
            console.log('Răspuns API pentru disciplină:', data); // Verificăm ce răspuns primim

            if (Array.isArray(data)) {
              setScheduleData(data);
            } else if (data && data.schedule && Array.isArray(data.schedule)) {
              setScheduleData(data.schedule);
            } else {
              console.error("Datele primite nu sunt un array valid:", data);
              setScheduleData([]);
            }
            setSelectedDiscipline(disciplina);
          })
          .catch((err) => {
            console.error("Eroare la preluarea orarului disciplinei:", err);
          });
    }
  }, [an, grupa, profesor, sala, disciplina]);

  const handleRoomClick = (roomName) => {
    setSelectedRoom(roomName);
    navigate(`/app/orar/sali/${roomName}`);
  };

  const handleDotariClick = () => {
    if (selectedRoom) {
      navigate(`/app/orar/sali/${selectedRoom}/dotari`);
    }
  };

  const handleDisciplineClick = (disciplineName) => {
    setSelectedDiscipline(disciplineName);
    navigate(`/app/orar/discipline/${disciplineName}`);
  };

  const handleProfessorClick = (professorName) => {
    setSelectedProfessor(professorName);
    navigate(`/app/orar/profesori/${professorName}`);
    const url = `http://localhost:34101/orar/profesor/${professorName}`;
    fetch(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
    })
        .then((res) => res.json())
        .then((data) => {
          setScheduleData(data);
        })
        .catch((err) => {
          console.error("Eroare la preluarea orarului profesorului:", err);
        });
  };

  const handleBackButtonClick = () => {
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

  const handleBackToMain = () => {
    if (currentSection === "studenti") {
      navigate(`/app/orar`);
    } else if (currentSection === "profesori") {
      navigate(`/app/orar`);
    } else if (currentSection === "sali") {
      navigate(`/app/orar`);
    } else if (currentSection === "discipline") {
      navigate(`/app/orar`);
    } else {
      navigate(`/app/orar`);
    }
  };

  const handleSectionChange = (newSection) => {
    setCurrentSection(newSection);
    navigate(`/app/orar/${newSection}`);
  };

  useEffect(() => {
    document.title = `Orar - ${selectedGroup || selectedProfessor || selectedRoom || selectedDiscipline || "Alege o categorie"}`;
  }, [selectedGroup, selectedProfessor, selectedRoom, selectedDiscipline]);

  return (
      <div className="orar-container">
        <button className="toggle-button" onClick={handleSwitchToSecretariat}>
          Switch la Orar Secretariat
        </button>

        {["/app/orar/studenti", "/app/orar/profesori", "/app/orar/sali", "/app/orar/discipline"].includes(location.pathname) && (
            <button className="orar-button inapoi" onClick={handleBackToMain}>
              🔙 Înapoi
            </button>
        )}

        {selectedGroup || selectedProfessor || selectedRoom || selectedDiscipline ? (
            <div className="orar-afisat">
              <h3>
                Orar pentru {selectedGroup || (selectedProfessor && `Profesor ${selectedProfessor}`) || (selectedRoom && `Sala ${selectedRoom}`) || (selectedDiscipline && `Disciplina ${selectedDiscipline}`)}
              </h3>
              <ScheduleTable
                  schedule={scheduleData}
              />
              {selectedRoom && (
                  <button
                      className="orar-button dotari"
                      onClick={handleDotariClick}
                  >
                    Dotări
                  </button>
              )}
              <button
                  className="orar-button inapoi"
                  onClick={handleBackButtonClick}
              >
                🔙 Înapoi
              </button>
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
