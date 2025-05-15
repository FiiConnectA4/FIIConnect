import SecretarySidebar from "../components/Sidebar-Secretar/SecretarySidebar";
import NotificationBell from "../components/notifications/NotificationBell";
import LogoutButton from "../components/logout-button/LogoutButton";
import { Outlet } from "react-router-dom";

const SecretaryLayout = () => {
    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <SecretarySidebar/>
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

export default SecretaryLayout;
