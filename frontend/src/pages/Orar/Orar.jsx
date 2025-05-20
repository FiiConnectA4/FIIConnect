import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Orar = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const rol = localStorage.getItem("role"); // presupunem că ai salvat rolul la login
    if (rol === "ROLE_ADMIN") {
      navigate("/app/orar-secretariat");
    } else {
      navigate("/app/orar");
    }
  }, [navigate]);

  return null; // sau un loader dacă vrei
};

export default Orar;