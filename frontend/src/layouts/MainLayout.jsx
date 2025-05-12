import Sidebar from "../components/Sidebar/Sidebar";
import NotificationBell from "../components/notifications/NotificationBell";
import { Outlet, useNavigate } from "react-router-dom";

const MainLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

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
                    <button onClick={handleLogout}>Logout</button>
                </div>

                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;
