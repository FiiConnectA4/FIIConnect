import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Orar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determină dacă utilizatorul este pe pagina "Orar" sau "OrarSecretariat"
  const isSecretariat = location.pathname.includes("orar-secretariat");

  const handleSwitch = () => {
    if (isSecretariat) {
      navigate("/app/orar"); // Navighează la pagina "Orar"
    } else {
      navigate("/app/orar-secretariat"); // Navighează la pagina "OrarSecretariat"
    }
  };

  return (
    <div>
      <button className="toggle-button" onClick={handleSwitch}>
        {isSecretariat ? "Switch la Orar" : "Switch la Orar Secretariat"}
      </button>
    </div>
  );
};

export default Orar;