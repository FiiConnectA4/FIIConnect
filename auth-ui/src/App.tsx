

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthApp from './AuthApp'; // componenta cu login, register, reset, dashboard etc.
import { CreateAccount, ResetPassword } from './AdminPages'; // asigură-te că calea este corectă
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Ruta pentru pagina de login și alte pagini de autentificare */}
        <Route path="/login/*" element={<AuthApp />} />

        {/* Ruta pentru pagina de creare cont (admin) */}
        <Route path="/admin/create-account" element={<CreateAccount />} />

        {/* Ruta pentru pagina de resetare admin sau orice altă pagină pentru admin */}
        <Route path="/admin/reset-password" element={<ResetPassword />} />

        {/* Redirecționează orice altă adresă către "/login" */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;