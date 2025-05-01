import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ResetPasswordPage.css';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // 1. Toate câmpurile completate
    if (!oldPass || !newPass || !confirmPass) {
      setError('Please fill in all fields.');
      return;
    }
    // 2. Noua parolă trebuie diferită de cea veche
    if (newPass === oldPass) {
      setError('New password must be different from the old password.');
      return;
    }
    // 3. Confirmarea trebuie să coincidă cu noua parolă
    if (newPass !== confirmPass) {
      setError('New password and confirmation do not match.');
      return;
    }

    // TODO: cheamă API-ul de resetare aici
    alert('Password reset successful!');
    navigate(-1); // înapoi la profil
  };

  return (
    <div className="reset-wrapper">
      <form className="reset-form" onSubmit={handleSubmit}>
        <h2 className="reset-title">Reset Password</h2>

        <label className="reset-label">
          Old Password
          <input
            type="password"
            className="reset-input"
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
            placeholder="Enter old password"
          />
        </label>

        <label className="reset-label">
          New Password
          <input
            type="password"
            className="reset-input"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            placeholder="Enter new password"
          />
        </label>

        <label className="reset-label">
          Confirm New Password
          <input
            type="password"
            className="reset-input"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            placeholder="Confirm new password"
          />
        </label>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="reset-button">
          Reset
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
