import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./Sidebar.css";
import SidebarButton from "../SidebarButton/SidebarButton";

const Sidebar = () => {
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
    { name: "Contul", icon: "👤" },
    { name: "Contact", icon: "📧" },
<<<<<<< HEAD
=======
    { name: "Secretariat", icon: "🏛️"},
>>>>>>> 72f2310f0 (finalmerge)
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="logo">
          FII<span>Connect</span>
        </div>

        <div className="section">GENERAL</div>
        <ul className="nav-list">
          {generalLinks.map((link, index) => (
            <SidebarButton
              key={index}
              icon={link.icon}
              label={link.name}
              to={`/app/${link.name.toLowerCase()}`}
            />
          ))}
        </ul>

        <div className="section">MANAGEMENT</div>
        <ul className="nav-list">
          {managementLinks.map((link, index) => (
            <SidebarButton
              key={index}
              icon={link.icon}
              label={link.name}
              to={`/app/${link.name.toLowerCase()}`}
            />
          ))}
        </ul>
      </div>

      <div className="sidebar-bottom">
        <p className="footer">2025 © FIIConnect</p>
        <ThemeToggle />
      </div>
    </aside>
  );
};

export default Sidebar;