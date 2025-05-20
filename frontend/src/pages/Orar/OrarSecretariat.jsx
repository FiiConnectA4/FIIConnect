import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import ScheduleTable from "../../components/ScheduleTable/ScheduleTable";
import OrarStudenti from "./OrarStudenti";
import OrarProfesori from "./OrarProfesori";
import OrarDiscipline from "./OrarDiscipline";
import OrarSali from "./OrarSali";
import "./OrarToti.css";
import { sorteazaOrar } from "../../components/ScheduleTable/ScheduleTable";

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

  const fetchSchedule = async (url) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();

      console.log("Server data:", data);

      if (Array.isArray(data)) {
        const sortedData = sorteazaOrar(data);
        setScheduleData(sortedData);
      } else {
        console.warn("Răspuns invalid:", data);
        setScheduleData([]);
      }
    } catch (err) {
      console.error("Eroare la preluarea datelor:", err);
      setScheduleData([]);
    }
  };

  /*const handleSwitchToOrar = () => {
    navigate("/app/orar");
  };*/

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
    if (currentSection) {
      let url = "";
      if (currentSection === "studenti" && selectedGroup) {
        const [an, grupa] = selectedGroup.split(" - ");
        url = `http://localhost:34101/orar-secretariat/grupa/${an.replace("Anul ", "")}/${grupa}`;
      } else if (currentSection === "profesori" && selectedProfessor) {
        url = `http://localhost:34101/orar-secretariat/profesor/${selectedProfessor}`;
      } else if (currentSection === "sali" && selectedRoom) {
        url = `http://localhost:34101/orar-secretariat/sala/${selectedRoom}`;
      } else if (currentSection === "discipline" && selectedDiscipline) {
        url = `http://localhost:34101/orar-secretariat/disciplina/${selectedDiscipline}`;
      }

      if (url) {
        fetchSchedule(url);
      }
    }
  }, [currentSection, selectedGroup, selectedProfessor, selectedRoom, selectedDiscipline]);

  const handleDataUpdated = () => {
    if (selectedGroup) {
      const [an, grupa] = selectedGroup.split(" - ");
      const url = `http://localhost:34101/orar-secretariat/grupa/${an.replace("Anul ", "")}/${grupa}`;
      console.log("Fetching data for group:", url);
      fetchSchedule(url);
    } else if (selectedProfessor) {
      const url = `http://localhost:34101/orar-secretariat/profesor/${selectedProfessor}`;
      console.log("Fetching data for professor:", url);
      fetchSchedule(url);
    } else if (selectedRoom) {
      const url = `http://localhost:34101/orar-secretariat/sala/${selectedRoom}`;
      console.log("Fetching data for room:", url);
      fetchSchedule(url);
    } else if (selectedDiscipline) {
      const url = `http://localhost:34101/orar-secretariat/disciplina/${selectedDiscipline}`;
      console.log("Fetching data for discipline:", url);
      fetchSchedule(url);
    }
  };

  useEffect(() => {
    if (an && grupa) {
      const anLabel = `Anul ${an}`;
      const groupLabel = `${anLabel} - ${grupa}`;
      setSelectedGroup(groupLabel);
      setCurrentSection("studenti");
      fetchSchedule(`http://localhost:34101/orar-secretariat/grupa/${an}/${grupa}`);
    } else if (profesor) {
      setSelectedProfessor(profesor);
      setCurrentSection("profesori");
      fetchSchedule(`http://localhost:34101/orar-secretariat/profesor/${profesor}`);
    } else if (sala) {
      setSelectedRoom(sala);
      setCurrentSection("sali");
      fetchSchedule(`http://localhost:34101/orar-secretariat/sala/${sala}`);
    } else if (disciplina) {
      setSelectedDiscipline(disciplina);
      setCurrentSection("discipline");
      fetchSchedule(`http://localhost:34101/orar-secretariat/disciplina/${disciplina}`);
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
    if (currentSection) {
      navigate(`/app/orar-secretariat/${currentSection}`);
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
    navigate(`/app/orar-secretariat`);
  };

  return (
    <div className="orar-container">
      {/* <button className="toggle-button" onClick={handleSwitchToOrar}>
        Switch la Orar
      </button> */}

      {["/app/orar-secretariat/studenti", "/app/orar-secretariat/profesori", "/app/orar-secretariat/sali", "/app/orar-secretariat/discipline"].includes(location.pathname) && (
        <button className="orar-button inapoi" onClick={handleBackToMain}>
          🔙 Înapoi
        </button>
      )}

      {selectedGroup || selectedProfessor || selectedRoom || selectedDiscipline ? (
        <div className="orar-afisat">
          <h3>
            Orar pentru{" "}
            {selectedGroup ||
              (selectedProfessor && `Profesor ${selectedProfessor}`) ||
              (selectedRoom && `Sala ${selectedRoom}`) ||
              (selectedDiscipline && `Disciplina ${selectedDiscipline}`)}
          </h3>

          <ScheduleTable
            schedule={Array.isArray(scheduleData) ? scheduleData : []}
            
            editable={true}
            onDataChange={(newData) => {
              console.log("Updated data:", newData);
              const sortedData = sorteazaOrar(newData);
              setScheduleData(sortedData);
              handleDataUpdated();
            }}
          />

          <button className="orar-button inapoi" onClick={handleBackButtonClick}>
            🔙 Înapoi
          </button>

          {selectedRoom && (
            <button className="orar-button dotari" onClick={handleDotariClick}>
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
              <button className="orar-button" onClick={() => handleSectionChange("studenti")}>
                🎓 Orar Studenți
              </button>
              <button className="orar-button" onClick={() => handleSectionChange("profesori")}>
                👨‍🏫 Orar Profesori
              </button>
              <button className="orar-button" onClick={() => handleSectionChange("sali")}>
                🏫 Orar Săli
              </button>
              <button className="orar-button" onClick={() => handleSectionChange("discipline")}>
                📚 Orar Discipline
              </button>
            </div>
          )}

          {currentSection === "studenti" && <OrarStudenti isSecretariat={true} />}
          {currentSection === "profesori" && <OrarProfesori onProfessorClick={handleProfessorClick} />}
          {currentSection === "discipline" && <OrarDiscipline isSecretariat={true} />}
          {currentSection === "sali" && <OrarSali onRoomClick={handleRoomClick} />}
        </>
      )}
    </div>
  );
};

export default OrarSecretariat;
