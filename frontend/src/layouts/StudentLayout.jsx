// src/layouts/StudentLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";

import StudentSidebar from "../components/Sidebar-Student/StudentSidebar";
import NotificationBell from "../components/notifications/NotificationBell";
import LogoutButton from "../components/logout-button/LogoutButton";

import "../styles/StudentLayout.css";

const StudentLayout = () => (
    <div className="layout">
        {/* 1) Sidebar-ul rămâne FIXED */}
        <StudentSidebar />

        {/* 2) Conținutul începe după 240px */}
        <div className="content">
            <header
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "0.3rem", // ✅ mai apropiate 🔔 și Logout
                marginBottom: "1rem",
              }}
            >

                <NotificationBell />
                <LogoutButton />
            </header>
            <Outlet />
        </div>
    </div>
);

export default StudentLayout;
