// src/components/StudentSidebar.js
import React from "react";
import { jwtDecode } from "jwt-decode";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "../../styles/Sidebar.css";
import SidebarButton from "../SidebarButton/SidebarButton";

const StudentSidebar = () => {
  const token = localStorage.getItem("token");
  let isAdmin = false;
  if (token) {
    try {
      const { authorities, roles } = jwtDecode(token);
      const hasAdminAuth = Array.isArray(authorities) && authorities.includes("ROLE_ADMIN");
      const hasAdminRole = Array.isArray(roles)      && roles.includes("ROLE_ADMIN");
      isAdmin = hasAdminAuth || hasAdminRole;
    } catch (e) {
      console.warn("Invalid token:", e);
    }
  }


  const generalLinks = [
    { name: "Dashboard", icon: "🏠" },
    { name: "Anunturi", icon: "📢" },
    { name: "Harta", icon: "🗺️" },
    { name: "Cursuri", icon: "📚" },
    { name: "Catalog", icon: "📘" },
    { name: "Orar", icon: "🕒" },
    { name: "Chat", icon: "💬" },
  ];

  const managementLinks = [
    { name: "Profile", icon: "👤", to: "profile" },
    { name: "Contact", icon: "📧" },
    { name: "Secretariat", icon: "🏛️" },
    { name: "Create Account", icon: "👤", to: "create-account", adminOnly: true },
    { name: "Service Page", icon: "👤", to: "service",  adminOnly: true },
  ];

  return (
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="logo">
            FII<span>Connect</span>
          </div>

          <div className="section">GENERAL</div>
          <ul className="nav-list">
            {generalLinks.map((link, idx) => (
                <SidebarButton
                    key={idx}
                    icon={link.icon}
                    label={link.name}
                    to={`/app/${link.name.toLowerCase()}`}
                />
            ))}
          </ul>

          <div className="section">MANAGEMENT</div>
          <ul className="nav-list">
            {managementLinks.map((link, idx) => {
              // dacă e adminOnly și nu e admin, sărim
              if (link.adminOnly && !isAdmin) return null;
              const path = link.to || link.name.toLowerCase();
              return (
                  <SidebarButton
                      key={idx}
                      icon={link.icon}
                      label={link.name}
                      to={`/app/${path}`}
                  />
              );
            })}
          </ul>
        </div>

        <div className="sidebar-bottom">
          <p className="footer">2025 © FIIConnect</p>
          <ThemeToggle />
        </div>
      </aside>
  );
};

export default StudentSidebar;
