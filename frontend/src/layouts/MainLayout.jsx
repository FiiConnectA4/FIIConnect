import Sidebar from "../components/Sidebar/Sidebar";
import NotificationBell from "../components/notifications/NotificationBell";
import LogoutButton from "../components/logout-button/LogoutButton";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar />
            <div style={{ flex: 1, padding: "2rem" }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: "1rem",
                        marginBottom: "1rem",
                    }}
                >
                    <NotificationBell />
                    <LogoutButton />
                </div>

                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;
