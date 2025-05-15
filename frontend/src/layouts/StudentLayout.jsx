import StudentSidebar from "../components/Sidebar-Student/StudentSidebar";
import NotificationBell from "../components/notifications/NotificationBell";
import LogoutButton from "../components/logout-button/LogoutButton";
import { Outlet } from "react-router-dom";

const StudentLayout = () => {
    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <StudentSidebar />
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

export default StudentLayout;
