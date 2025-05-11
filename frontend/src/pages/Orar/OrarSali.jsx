import React from "react";
import { useNavigate } from "react-router-dom";

const OrarSali = ({ onRoomClick }) => {
  const navigate = useNavigate();

  // Listă cu săli
  const sali = [
    "C2", "C112", "C210", "C308", "C309", "C401", "C403", "C405", "C409", "C411", "C412", "C413", "C901", "C903"
  ];

  // Selectează sala și navighează către URL-ul corespunzător
  const handleSalaSelect = (sala) => {
    navigate(`/app/orar/sali/${sala}`); 
    onRoomClick(sala); 
  };

  return (
    <div className="orar-sali-container">
      <h2>Alege o sală</h2>
      <div className="orar-sali-grid">
        {sali.map((sala, index) => (
          <button
            key={index}
            className="orar-button"
            onClick={() => handleSalaSelect(sala)}
          >
            {sala}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrarSali;