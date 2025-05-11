import React, { useState } from "react";
import "./SecretariatToti.css";
import CerereDecontari from "./CerereDecontari";
import CerereAdeverinte from "./CerereAdeverinte";
import CerereBursaSociala from "./CerereBursaSociala";

const SecretariatToti = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleBackClick = () => {
    setSelectedOption(null); // Revine la pagina principală
  };

  if (selectedOption === "decontari") {
    return <CerereDecontari onBack={handleBackClick} />;
  }

  if (selectedOption === "adeverinte") {
    return <CerereAdeverinte onBack={handleBackClick} />;
  }

  if (selectedOption === "bursa-sociala") {
    return <CerereBursaSociala onBack={handleBackClick} />;
  }

  return (
    <div className="secretariat-container">
      <div className="secretariat-titlu">
        <h1>Secretariat</h1>
        <h2>Alege o opțiune</h2>
      </div>
      <div className="secretariat-buttons">
        <button
          className="secretariat-button"
          onClick={() => setSelectedOption("decontari")}
        >
          <span className="icon">🧾</span>
          Cerere Decontări
        </button>
        <button
          className="secretariat-button"
          onClick={() => setSelectedOption("adeverinte")}
        >
          <span className="icon">📝</span>
          Cerere Adeverințe
        </button>
        <button
          className="secretariat-button"
          onClick={() => setSelectedOption("bursa-sociala")}
        >
          <span className="icon">💰</span>
          Cerere Bursă Socială
        </button>
        <button
          className="secretariat-button"
          onClick={() => setSelectedOption("vezi-cereri")}
        >
          <span className="icon">📄</span>
          Istoric Cereri
        </button>
      </div>
      {selectedOption === "vezi-cereri" && (
        <div className="secretariat-output">
          <h2>Istoric Cereri</h2>
        </div>
      )}
    </div>
  );
};

export default SecretariatToti;