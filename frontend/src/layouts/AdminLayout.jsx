import AdminSidebar from "../components/Sidebar-Admin/AdminSidebar";
import NotificationBell from "../components/notifications/NotificationBell";
import LogoutButton from "../components/logout-button/LogoutButton";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <AdminSidebar />
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
                    <LogoutButton />
                </div>

                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
