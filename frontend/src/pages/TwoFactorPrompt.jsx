import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TwoFactorPrompt.css';

const TwoFactorPrompt = () => {
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!token) {
      alert('Please enter your 2FA code');
      return;
    }
    // TODO: aici chemi API-ul de verificare a codului 2FA
    // dacă e valid → redirecționezi la dashboard
    navigate('/app/dashboard');
  };

  return (
    <div className="twofa-wrapper">
      <form className="twofa-form" onSubmit={handleSubmit}>
        <h2 className="twofa-title">Insert 2FA code</h2>
        <input
          type="text"
          className="twofa-input"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Enter 6-digit code"
        />
        <button type="submit" className="twofa-button">
          Verify
        </button>
      </form>
    </div>
  );
};

export default TwoFactorPrompt;
