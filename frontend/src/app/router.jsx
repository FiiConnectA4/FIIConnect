import { Routes, Route, Navigate } from "react-router-dom";
import StudentLayout from "../layouts/StudentLayout";

import Dashboard from "../pages/Dashboard/Dashboard";
import Anunturi from "../pages/Social/Page/Anunturi";
import EtajeHarta from "../pages/Harta/EtajeHarta";
import Cursuri from "../pages/Cursuri/Cursuri";
import Catalog from "../pages/Catalog/Catalog";
import OrarToti from "../pages/Orar/OrarToti";
import Secretariat from "../pages/Secretariat/Secretariat";
import CerereDecontari from "../pages/Secretariat/CerereDecontari"; // ✅ Import corect
import CerereAdeverinte from "../pages/Secretariat/CerereAdeverinte"; // ✅ Import corect
import CerereBursaSociala from "../pages/Secretariat/CerereBursaSociala"; // ✅ Import corect
import CerereCazSocial from "../pages/Secretariat/CerereCazSocial"; // ✅ Import corect
import IstoricCereri from "../pages/Secretariat/IstoricCereri"; // ✅ Import corect
import Harta from "../pages/Harta/Harta";
import HartaFullScreen from "../pages/Harta/HartaFullScreen";

import SecretariatCerereAdeverinte from "../pages/Secretariat/SecretariatCerereAdeverinte"; // ✅ Import corect
import SecretariatBursaSociala from "../pages/Secretariat/SecretariatBursaSociala"; // ✅ Import corect
import SecretariatCazSocial from "../pages/Secretariat/SecretariatCazSocial"; // ✅ Import corect
import Chat from "../pages/Social/Page/Chat";
import SetupProfile from "../pages/Dashboard/SetupProfile";
import Profil from "../pages/Dashboard/Profil";
import Contact from "../pages/Contact";
import Setup2FA from "../pages/Auth/Setup2FA";
import Login from "../pages/Auth/Login";
import DotariSala from "../pages/Orar/DotariSala";
import OrarSecretariat from "../pages/Orar/OrarSecretariat";
import TwoFAVerify from "../pages/Auth/TwoFAVerify";
import PrivateRoute from "../components/PrivateRoute";
import ChangePassword from "../pages/Auth/ChangePassword";
import CreateAccount from "../pages/Auth/CreateAccount";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import Orar from "../pages/Orar/Orar"; // Import pentru componenta de routing

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public route (login page) */}
            <Route path="/" element={<Login />} />
            <Route path="/app/2fa" element={<TwoFAVerify />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected routes inside layout */}
            <Route
                path="/app"
                element={
                    <PrivateRoute>
                        <StudentLayout />
                    </PrivateRoute>
                }
            >
                <Route
                    path="create-account"
                    element={
                        <PrivateRoute allowedRoles={["ROLE_ADMIN"]}>
                            <CreateAccount />
                        </PrivateRoute>
                    }
                />

                <Route path="dashboard" element={<Dashboard />} />
                <Route path="anunturi" element={<Anunturi />} />
                <Route path="harta" element={<Harta />} />
                <Route path="etaje-harta" element={<EtajeHarta />} />
                <Route path="cursuri" element={<Cursuri />} />
                <Route path="catalog" element={<Catalog />} />

                {/* Rutele pentru orar - MUTATE ÎN INTERIOR */}
                <Route path="orar" element={<Orar />} />

                <Route path="orar/studenti" element={<OrarToti />} />
                <Route path="orar/studenti/:an/:grupa" element={<OrarToti />} />
                <Route path="orar/profesori" element={<OrarToti />} />
                <Route path="orar/profesori/:profesor" element={<OrarToti />} />
                <Route path="orar/sali" element={<OrarToti />} />
                <Route path="orar/sali/:sala" element={<OrarToti />} />
                <Route path="orar/sali/:sala/dotari" element={<DotariSala />} />
                <Route path="orar/discipline" element={<OrarToti />} />
                <Route path="orar/discipline/:disciplina" element={<OrarToti />} />

                <Route path="orar-secretariat" element={<OrarSecretariat />} />
                <Route path="orar-secretariat/studenti" element={<OrarSecretariat />} />
                <Route path="orar-secretariat/studenti/:an/:grupa" element={<OrarSecretariat />} />
                <Route path="orar-secretariat/profesori" element={<OrarSecretariat />} />
                <Route path="orar-secretariat/profesori/:profesor" element={<OrarSecretariat />} />
                <Route path="orar-secretariat/sali" element={<OrarSecretariat />} />
                <Route path="orar-secretariat/sali/:sala" element={<OrarSecretariat />} />
                <Route path="orar-secretariat/discipline" element={<OrarSecretariat />} />
                <Route path="orar-secretariat/discipline/:disciplina" element={<OrarSecretariat />} />

                <Route path="harta" element={<Harta />} />
                <Route path="harta/fullscreen" element={<HartaFullScreen />} />

                <Route path="secretariat" element={<Secretariat />} />
                <Route path="secretariat/cerere-decontare" element={<CerereDecontari />} />
                <Route path="secretariat/cerere-adeverinte" element={<SecretariatCerereAdeverinte />} />
                <Route path="secretariat/cerere-bursa-sociala" element={<SecretariatBursaSociala />} />
                <Route path="secretariat/cerere-caz-social" element={<SecretariatCazSocial />} />

                <Route path="student/cerere-decontare" element={<CerereDecontari />} />
                <Route path="student/cerere-adeverinte" element={<CerereAdeverinte />} />
                <Route path="student/cerere-bursa-sociala" element={<CerereBursaSociala />} />
                <Route path="student/cerere-caz-social" element={<CerereCazSocial />} />
                <Route path="student/istoric-cereri" element={<IstoricCereri />} />

                <Route path="chat" element={<Chat />} />
                <Route path="profile" element={<Profil />} />
                <Route path="reset-password" element={<ChangePassword />} />
                <Route path="setup-2fa" element={<Setup2FA />} />
                <Route path="setup-profile" element={<SetupProfile />} />
                <Route path="contact" element={<Contact />} />
                <Route index element={<Navigate to="/app/dashboard" replace />} />
            </Route>

            {/* Catch unknown paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;