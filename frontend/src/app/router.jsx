import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/Dashboard";
import Anunturi from "../pages/Social/Page/Anunturi";
import Harta from "../pages/Harta";
import Cursuri from "../pages/Cursuri/Cursuri";
import Catalog from "../pages/Catalog";
import OrarToti from "../pages/Orar/OrarToti";
import Secretariat from "../pages/Secretariat/Secretariat";
import SecretariatToti from "../pages/Secretariat/SecretariatToti";
import CerereDecontari from "../pages/Secretariat/CerereDecontari"; // ✅ Import corect
import CerereAdeverinte from "../pages/Secretariat/CerereAdeverinte"; // ✅ Import corect
import CerereBursaSociala from "../pages/Secretariat/CerereBursaSociala"; // ✅ Import corect
import CerereCazSocial from "../pages/Secretariat/CerereCazSocial"; // ✅ Import corect
import IstoricCereri from "../pages/Secretariat/IstoricCereri"; // ✅ Import corect

import SecretariatCerereAdeverinte from "../pages/Secretariat/SecretariatCerereAdeverinte"; // ✅ Import corect
import SecretariatBursaSociala from "../pages/Secretariat/SecretariatBursaSociala"; // ✅ Import corect
import SecretariatCazSocial from "../pages/Secretariat/SecretariatCazSocial"; // ✅ Import corect
import Chat from "../pages/Social/Page/Chat";
import Contul from "../pages/Contul";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import DotariSala from "../pages/Orar/DotariSala";
import OrarSecretariat from "../pages/Orar/OrarSecretariat";
import PrivateRoute from "../components/PrivateRoute"; // ✅ Importăm PrivateRoute

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public route (login page) */}
      <Route path="/" element={<Login />} />

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


        <Route path="secretariat" element={<Secretariat />}>
          <Route index element={<SecretariatToti />} />
          <Route path="cerere-decontare" element={<CerereDecontari />} />
          <Route path="cerere-adeverinte" element={<SecretariatCerereAdeverinte />} />
          <Route path="cerere-bursa-sociala" element={<SecretariatBursaSociala />} />
          <Route path="cerere-caz-social" element={<SecretariatCazSocial />} />
         
        </Route>

<Route path="student" element={<Secretariat />}>
  <Route index element={<SecretariatToti />} />
  <Route path="cerere-decontare" element={<CerereDecontari />} />
  <Route path="cerere-adeverinte" element={<CerereAdeverinte />} />
  <Route path="cerere-bursa-sociala" element={<CerereBursaSociala />} />
  <Route path="cerere-caz-social" element={<CerereCazSocial />} />
  <Route path="istoric-cereri" element={<IstoricCereri />} />
</Route>


        <Route path="secretariat" element={<Secretariat />} />
        <Route path="chat" element={<Chat />} />
        <Route path="contul" element={<Contul />} />
        <Route path="contact" element={<Contact />} />
        <Route index element={<Navigate to="/app/dashboard" replace />} />
      </Route>

      {/* Catch unknown paths */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
