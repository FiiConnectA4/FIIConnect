import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/Dashboard";
import Anunturi from "../pages/Anunturi";
import Harta from "../pages/Harta";
import Cursuri from "../pages/Cursuri";
import Catalog from "../pages/Catalog";
import Orar from "../pages/Orar";
import Chat from "../pages/Chat";
import Contul from "../pages/Contul";
import Contact from "../pages/Contact";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="anunturi" element={<Anunturi />} />
        <Route path="harta" element={<Harta />} />
        <Route path="cursuri" element={<Cursuri />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="orar" element={<Orar />} />
        <Route path="chat" element={<Chat />} />
        <Route path="contul" element={<Contul />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
