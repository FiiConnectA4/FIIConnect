import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Orar = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const rol = localStorage.getItem("role");
    if (rol === "ROLE_ADMIN") {
      navigate("/app/orar-secretariat", { replace: true });
    } else if (rol === "ROLE_STUDENT") {
      navigate("/app/orar", { replace: true });
    } else {
      navigate("/"); // în cazul neautentificat
    }
  }, [navigate]);

  return null;
};

export default Orar;
