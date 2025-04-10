import { NavLink } from "react-router-dom";
import "./SidebarButton.css";

const SidebarButton = ({ icon, label, to }) => {
    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          `sidebar-button ${isActive ? "active" : ""}`
        }
      >
        <span className="icon-circle">{icon}</span>
        <span className="label">{label}</span>
      </NavLink>
    );
  };
  
  export default SidebarButton;