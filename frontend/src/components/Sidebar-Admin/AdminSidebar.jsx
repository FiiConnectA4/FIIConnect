import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "../../styles/Sidebar.css";
import SidebarButton from "../SidebarButton/SidebarButton";

const AdminSidebar = () => {
  const generalLinks = [
    { name: "Dashboard", icon: "🏠" },
    { name: "Anunturi", icon: "📢" },
    { name: "Harta", icon: "🗺️" },
    { name: "Cursuri", icon: "📚" },
    { name: "Catalog", icon: "📘" },
    { name: "Orar", icon: "🕒" },
    { name: "Chat", icon: "💬" },
  ];

  const adminLinks = [
    { name: "Admin Dashboard", icon: "🔧" },
    { name: "Management Utilizatori", icon: "🔧" },
    { name: "Service", icon: "🔧️" },
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

      <div className="section">ADMIN</div>
      <ul className="nav-list">
        {adminLinks.map((link, index) => (
            <SidebarButton
                key={index}
                icon={link.icon}
                label={link.name}
                to={`/app/${link.to || link.name.toLowerCase()}`}
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

export default AdminSidebar;