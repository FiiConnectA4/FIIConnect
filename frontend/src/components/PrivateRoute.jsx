import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

function PrivateRoute({ children, allowedRoles }) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");

      console.log("[PrivateRoute] Token folosit:", token);

      if (!token) {
        console.warn("[PrivateRoute] Token lipsă → redirect la login");
        setAuthorized(false);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:34101/person/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userRole = response.data.role || "";
        const hasAccess = allowedRoles
          ? allowedRoles.includes(userRole)
          : true;

        console.log("[PrivateRoute] Rol utilizator:", userRole);
        console.log("[PrivateRoute] Access permis:", hasAccess);

        setAuthorized(hasAccess);
      } catch (error) {
        console.error("[PrivateRoute] Eroare token:", error?.response?.status);
        localStorage.removeItem("token");
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, [allowedRoles]);

  if (loading) return <div>Se verifică autentificarea...</div>;

  return authorized ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
