import React, { useState } from 'react';

// Pagina de creare cont (disponibilă doar pentru admin)
export const CreateAccount = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [accountType, setAccountType] = useState('student'); // valoare implicită: 'student'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email) {
      alert("Te rog completează toate câmpurile obligatorii.");
      return;
    }
    // Aici poți apela API-ul de creare cont, de exemplu
    alert(`Cont creat pentru: ${username}\nEmail: ${email}`);
  };

  return (
    <div className="page-content">
      <h2>Creare Cont (doar pentru admin)</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <input
          className="auth-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="auth-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {/* Dropdown pentru tipul contului */}
        <select
          className="auth-input"
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="profesor">Profesor</option>
        </select>
        <button type="submit" className="auth-button">
          Creează cont
        </button>
      </form>
    </div>
  );
};

// Pagina de resetare parolă (mocked)
export const ResetPassword = () => {
  const [email, setEmail] = useState('');

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert("Te rog introdu email-ul.");
      return;
    }
    // Aici simulezi trimiterea unui link de resetare
    alert(`Un link de resetare a fost trimis la: ${email}`);
  };

  return (
    <div className="page-content">
      <h2>Resetare Parolă</h2>
      <form onSubmit={handleReset} className="form-container">
        <input
          className="auth-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="auth-button">
          Trimite link resetare
        </button>
      </form>
    </div>
  );
};