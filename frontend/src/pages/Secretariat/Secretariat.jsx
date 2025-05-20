import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const Secretariat = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const rol = localStorage.getItem("role");
    if (rol !== "ROLE_ADMIN") {
      navigate("/app/orar"); // sau altă rută pentru utilizatorii neadmin
    }
    // Dacă e admin, rămâne pe această pagină
  }, [navigate]);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default Secretariat;