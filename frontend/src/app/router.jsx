import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/Dashboard";
import Anunturi from "../pages/Social/Page/Anunturi";
import Harta from "../pages/Harta";
import Cursuri from "../pages/Cursuri/Cursuri";
import Catalog from "../pages/Catalog";
import OrarToti from "../pages/Orar/OrarToti"; 
import Secretariat from "../pages/Secretariat/Secretariat";
import Chat from "../pages/Social/Page/Chat";
import SetupProfile from "../pages/SetupProfile";
import Profil from "../pages/Profil";
import Contact from "../pages/Contact";
import Setup2FA from "../pages/Setup2FA";
import Login from "../pages/Login";
import DotariSala from "../pages/Orar/DotariSala";
import OrarSecretariat from "../pages/Orar/OrarSecretariat";
import TwoFAVerify from "../pages/TwoFAVerify";
import PrivateRoute from "../components/PrivateRoute"; // ✅ importăm PrivateRoute

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public route (login page) */}
      <Route path="/" element={<Login />} />
      <Route path="/app/2fa"     element={<TwoFAVerify />} />

      {/* Protected routes inside layout */}

      <Route
        path="/app"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >

        <Route path="dashboard" element={<Dashboard />} />
        <Route path="anunturi" element={<Anunturi />} />
        <Route path="harta" element={<Harta />} />
        <Route path="cursuri" element={<Cursuri />} />
        <Route path="catalog" element={<Catalog />} />

        {/* Rutele pentru orar */}
        <Route path="/app/orar" element={<OrarToti />} />
<Route path="/app/orar/studenti" element={<OrarToti />} />
<Route path="/app/orar/studenti/:an/:grupa" element={<OrarToti />} />
<Route path="/app/orar/profesori" element={<OrarToti />} />
<Route path="/app/orar/profesori/:profesor" element={<OrarToti />} />
<Route path="/app/orar/sali" element={<OrarToti />} />
<Route path="/app/orar/sali/:sala" element={<OrarToti />} />
<Route path="/app/orar/sali/:sala/dotari" element={<DotariSala />} />
<Route path="/app/orar/discipline" element={<OrarToti />} />
<Route path="/app/orar/discipline/:disciplina" element={<OrarToti />} />


<Route path="/app/orar-secretariat" element={<OrarSecretariat />} />
<Route path="/app/orar-secretariat/studenti" element={<OrarSecretariat />} />
<Route path="/app/orar-secretariat/studenti/:an/:grupa" element={<OrarSecretariat />} />
<Route path="/app/orar-secretariat/profesori" element={<OrarSecretariat />} />
<Route path="/app/orar-secretariat/profesori/:profesor" element={<OrarSecretariat />} />
<Route path="/app/orar-secretariat/sali" element={<OrarSecretariat />} />
<Route path="/app/orar-secretariat/sali/:sala" element={<OrarSecretariat />} />
<Route path="/app/orar-secretariat/discipline" element={<OrarSecretariat />} />
<Route path="/app/orar-secretariat/discipline/:disciplina" element={<OrarSecretariat />} />
          <Route path="secretariat" element={<Secretariat />} />
        <Route path="chat" element={<Chat />} />
          <Route path="profile" element={<Profil />} />
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
