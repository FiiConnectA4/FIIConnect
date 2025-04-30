import Sidebar from "../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import ProfileButton from "../components/ProfileButton/ProfileButton";

const MainLayout = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "1rem 2rem",
            borderBottom: "1px solid #e5e7eb",
            alignItems: "center",
          }}
        >
          <ProfileButton />
        </div>

        {/* Pagina curentă */}
        <div style={{ padding: "2rem", flex: 1, overflowY: "auto" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
