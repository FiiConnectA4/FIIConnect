import React, { useState } from "react";
import "./CerereAdeverinte.css";

const CerereAdeverinte = ({ onBack }) => {
  const [selectedType, setSelectedType] = useState(null);

  const adeverinteTypes = [
    "Adeverință Student",
    "Adeverință Angajator/Practică",
    "Adeverință Cămin",
  ];

  if (selectedType) {
    return (
      <div className="cerere-adeverinte-container">
        <h1>{selectedType}</h1>
        <p>Aici poți completa cererea pentru {selectedType.toLowerCase()}.</p>
        <button onClick={() => setSelectedType(null)} className="back-button">
          Înapoi la tipurile de adeverințe
        </button>
      </div>
    );
  }

  return (
    <div className="cerere-adeverinte-container">
      <h1>Cerere Adeverințe</h1>
      <ul className="adeverinte-list">
        {adeverinteTypes.map((type) => (
          <li key={type}>
            <button
              className="adeverinte-button"
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          </li>
        ))}
      </ul>
      <button onClick={onBack} className="back-button">
        Înapoi
      </button>
    </div>
  );
};

export default CerereAdeverinte;