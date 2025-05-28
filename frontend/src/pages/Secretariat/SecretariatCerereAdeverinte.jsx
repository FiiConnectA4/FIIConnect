import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importăm useNavigate
import SecretariatAdeverintaStudent from "./SecretariatAdeverintaStudent";
import SecretariatCerereCamin from "./SecretariatCerereCamin";

import "./CerereAdeverinte.css";

const SecretariatCerereAdeverinte = () => {
  const [selectedType, setSelectedType] = useState(null);
  const navigate = useNavigate(); // Inițializăm useNavigate

  const adeverinteTypes = [
    { label: "Adeverință Student", component: SecretariatAdeverintaStudent },
    { label: "Adeverință Cămin", component: SecretariatCerereCamin },
  ];

  if (selectedType) {
    const SelectedComponent = selectedType.component;
    return <SelectedComponent onBack={() => setSelectedType(null)} />;
  }

  return (
    <div className="cerere-adeverinte-container">
      <h1>Cerere Adeverințe</h1>
      <ul className="adeverinte-list">
        {adeverinteTypes.map((type) => (
          <li key={type.label}>
            <button
              className="adeverinte-button"
              onClick={() => setSelectedType(type)}
            >
              {type.label}
            </button>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate(-1)} className="back-button">
        Înapoi
      </button>
    </div>
  );
};

export default SecretariatCerereAdeverinte;