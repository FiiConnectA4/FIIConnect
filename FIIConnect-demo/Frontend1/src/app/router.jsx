import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/Dashboard";
import Anunturi from "../pages/Anunturi";
import Harta from "../pages/Harta";
import Cursuri from "../pages/Cursuri/Cursuri";
import Catalog from "../pages/Catalog";
import Orar from "../pages/Orar/OrarToti";
<<<<<<< HEAD
=======
import Secretariat from "../pages/Secretariat/Secretariat";
>>>>>>> 72f2310f0 (finalmerge)
import Chat from "../pages/Chat";
import Contul from "../pages/Contul";
import Contact from "../pages/Contact";
import Login from "../pages/Login";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public route (login page) */}
      <Route path="/" element={<Login />} />

      {/* Protected routes inside layout */}
      <Route path="/app" element={<MainLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="anunturi" element={<Anunturi />} />
        <Route path="harta" element={<Harta />} />
        <Route path="cursuri" element={<Cursuri />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="/app/orar" element={<Orar />} />
<Route path="/app/orar/studenti" element={<Orar />} />
<Route path="/app/orar/grupa/:an/:grupa" element={<Orar />} />
<Route path="orar/studenti/:an/:grupa" element={<Orar />} />

<<<<<<< HEAD
=======
<Route path="secretariat" element={<Secretariat />} />

>>>>>>> 72f2310f0 (finalmerge)
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
