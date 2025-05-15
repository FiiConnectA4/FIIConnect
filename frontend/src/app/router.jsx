import { Routes, Route, Navigate } from "react-router-dom";
import StudentLayout from "../layouts/StudentLayout";
import AdminLayout from "../layouts/AdminLayout";
import SecretaryLayout from "../layouts/SecretaryLayout";
import PrivateRoute from "../components/PrivateRoute";

import Dashboard from "../pages/Dashboard";
import Anunturi from "../pages/Social/Page/Anunturi";
import Harta from "../pages/Harta";
import Cursuri from "../pages/Cursuri/Cursuri";
import Catalog from "../pages/Catalog";
import OrarToti from "../pages/Orar/OrarToti";
import DotariSala from "../pages/Orar/DotariSala";
import Secretariat from "../pages/Secretariat/Secretariat";
import Chat from "../pages/Social/Page/Chat";
import SetupProfile from "../pages/Dashboard/SetupProfile";
import Profil from "../pages/Dashboard/Profil";
import Contact from "../pages/Contact";
import Setup2FA from "../pages/Auth/Setup2FA";
import TwoFAVerify from "../pages/Auth/TwoFAVerify";
import Login from "../pages/Auth/Login";
import OrarSecretariat from "../pages/Orar/OrarSecretariat";

const secretariatRoutes = [
    "/app/orar-secretariat",
    "/app/orar-secretariat/studenti",
    "/app/orar-secretariat/studenti/:an/:grupa",
    "/app/orar-secretariat/profesori",
    "/app/orar-secretariat/profesori/:profesor",
    "/app/orar-secretariat/sali",
    "/app/orar-secretariat/sali/:sala",
    "/app/orar-secretariat/discipline",
    "/app/orar-secretariat/discipline/:disciplina",
];

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<Login />} />
            <Route path="/app/2fa" element={<TwoFAVerify />} />

            {/* Student routes */}
            <Route
                path="/app"
                element={
                    <PrivateRoute allowedRoles={["ROLE_STUDENT"]}>
                        <StudentLayout />
                    </PrivateRoute>
                }
            >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="anunturi" element={<Anunturi />} />
                <Route path="harta" element={<Harta />} />
                <Route path="cursuri" element={<Cursuri />} />
                <Route path="catalog" element={<Catalog />} />
                <Route path="orar" element={<OrarToti />} />
                <Route path="orar/studenti" element={<OrarToti />} />
                <Route path="orar/studenti/:an/:grupa" element={<OrarToti />} />
                <Route path="orar/profesori" element={<OrarToti />} />
                <Route path="orar/profesori/:profesor" element={<OrarToti />} />
                <Route path="orar/sali" element={<OrarToti />} />
                <Route path="orar/sali/:sala" element={<OrarToti />} />
                <Route path="orar/sali/:sala/dotari" element={<DotariSala />} />
                <Route path="orar/discipline" element={<OrarToti />} />
                <Route path="orar/discipline/:disciplina" element={<OrarToti />} />
                <Route path="chat" element={<Chat />} />
                <Route path="secretariat" element={<Secretariat />} />
                <Route path="setup-profile" element={<SetupProfile />} />
                <Route path="profile" element={<Profil />} />
                <Route path="contact" element={<Contact />} />
                <Route path="setup-2fa" element={<Setup2FA />} />
                <Route index element={<Navigate to="/app/dashboard" replace />} />
            </Route>

            {/* Secretary routes */}
            <Route
                path="/secretar"
                element={
                    <PrivateRoute allowedRoles={["ROLE_SECRETARY"]}>
                        <SecretaryLayout />
                    </PrivateRoute>
                }
            >
                {secretariatRoutes.map((path) => (
                    <Route
                        key={path}
                        path={path.replace("/app", "").replace(/^\/+/, "")}
                        element={<OrarSecretariat />}
                    />
                ))}
            </Route>

            {/* Admin routes */}
            <Route
                path="/admin"
                element={
                    <PrivateRoute allowedRoles={["ROLE_ADMIN"]}>
                        <AdminLayout />
                    </PrivateRoute>
                }
            >
                {/* TODO: Admin specific pages here */}
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
