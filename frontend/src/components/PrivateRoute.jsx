import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const userRoles = decoded.roles || [];

    const hasAccess = allowedRoles
        ? userRoles.some(role => allowedRoles.includes(role))
        : true;

    return hasAccess ? children : <Navigate to="/unauthorized" replace />;
  } catch (error) {
    return <Navigate to="/login" replace />;
  }
}

export default PrivateRoute;
