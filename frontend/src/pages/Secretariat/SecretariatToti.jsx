import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./SecretariatToti.css";

const SecretariatToti = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isStudentView = location.pathname.startsWith("/app/student");

  const handleSwitch = () => {
    if (isStudentView) {
      navigate("/app/secretariat");
    } else {
      navigate("/app/student");
    }
  };

  return (
    <div className="secretariat-container">
      <div className="secretariat-header">
        <div className="secretariat-titlu">
          <h1>{isStudentView ? "Cereri Student" : "Secretariat"}</h1>
          <h2>Alege o opțiune</h2>
        </div>
        <button className="switch-button" onClick={handleSwitch}>
          {isStudentView ? "Comută la Secretariat" : "Comută la Student"}
        </button>
      </div>

      <div className="secretariat-buttons">
        <Link
          to={`${isStudentView ? "/app/student" : "/app/secretariat"}/cerere-decontare`}
          className="secretariat-button"
        >
          🚌 Cerere Decontare CTP
        </Link>
        <Link
          to={`${isStudentView ? "/app/student" : "/app/secretariat"}/cerere-adeverinte`}
          className="secretariat-button"
        >
          📝 Cerere Adeverințe
        </Link>
        <Link
          to={`${isStudentView ? "/app/student" : "/app/secretariat"}/cerere-bursa-sociala`}
          className="secretariat-button"
        >
          💰 Cerere Bursă Socială
        </Link>
        <Link
          to={`${isStudentView ? "/app/student" : "/app/secretariat"}/cerere-caz-social`}
          className="secretariat-button"
        >
          📂 Cerere Caz Social
        </Link>

        {/* New button for tag assignment - only visible in secretariat view */}
        {!isStudentView && (
          <Link
            to={`/app/secretariat/atribuire-taguri`}
            className="secretariat-button"
          >
            🏷️ Atribuire Tag-uri
          </Link>
        )}

        {isStudentView && (
          <Link
            to={`/app/student/istoric-cereri`}
            className="secretariat-button"
          >
            📄 Istoric Cereri
          </Link>
        )}
      </div>
    </div>
  );
};

export default SecretariatToti;