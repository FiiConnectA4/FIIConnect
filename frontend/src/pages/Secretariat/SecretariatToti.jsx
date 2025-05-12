import React from "react";
import { Link } from "react-router-dom";
import "./SecretariatToti.css";

const SecretariatToti = () => {
  return (
    <div className="secretariat-container">
      <div className="secretariat-titlu">
        <h1>Secretariat</h1>
        <h2>Alege o opțiune</h2>
      </div>
      <div className="secretariat-buttons">
        <Link to="/app/secretariat/cerere-decontare" className="secretariat-button">
          <span className="icon">🚌</span>
          Cerere Decontare CTP
        </Link>
        <Link to="/app/secretariat/cerere-adeverinte" className="secretariat-button">
          <span className="icon">📝</span>
          Cerere Adeverințe
        </Link>
        <Link to="/app/secretariat/cerere-bursa-sociala" className="secretariat-button">
          <span className="icon">💰</span>
          Cerere Bursă Socială
        </Link>
        <Link to="/app/secretariat/cerere-caz-social" className="secretariat-button">
          <span className="icon">📂</span>
          Cerere Caz Social
        </Link>
        <Link to="/app/secretariat/istoric-cereri" className="secretariat-button">
          <span className="icon">📄</span>
          Istoric Cereri
        </Link>
      </div>
    </div>
  );
};

export default SecretariatToti;