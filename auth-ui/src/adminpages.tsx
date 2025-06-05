import React, { useState } from 'react';

// Pagina de creare cont (disponibilă doar pentru admin)
export const CreateAccount = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('STUDENT'); // valoare implicită: 'student'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validare pentru câmpurile obligatorii
    if (!username || !email || !password) {
      alert("Te rog completează toate câmpurile obligatorii.");
      return;
    }

    try {
      // Trimiterea datelor la backend pentru înregistrare
      const response = await fetch("http://localhost:34101/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, accountType }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Eroare: ${data.message}`);
      } else {
        alert(`Succes: ${data.message}`);
        setUsername("");
        setEmail("");
        setPassword("");
        setRoles("STUDENT");
      }
    } catch (error) {
      console.error("Eroare la înregistrare:", error);
      alert("A apărut o eroare la conectarea cu serverul.");
    }
  };

  return (
      <div className="page-content">
        <h2>Admin : Creare Cont</h2>
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
          <input
              className="auth-input"
              type="password"
              placeholder="Parola"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
          />
          {/* Dropdown pentru tipul contului */}
          <select
              className="auth-input"
              value={accountType}
              onChange={(e) => setRoles(e.target.value)}
          >
            <option value="STUDENT">Student</option>
            <option value="PROFESOR">Profesor</option>
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
