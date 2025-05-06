import Sidebar from "../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
            <Sidebar />
            <div
                style={{
                    flex: 1,
                    padding: "2rem",
                    overflowY: "auto",
                    height: "100vh",
                }}
            >
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;