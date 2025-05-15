import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ChangePassword.css'; // folosește același CSS

const ChangePassword = () => {
    const navigate = useNavigate();
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // 1. Verificare completare câmpuri
        if (!oldPass || !newPass || !confirmPass) {
            setError('Te rugăm să completezi toate câmpurile.');
            return;
        }

        // 2. Verificare diferență parolă nouă vs veche
        if (newPass === oldPass) {
            setError('Noua parolă trebuie să fie diferită de cea veche.');
            return;
        }

        // 3. Confirmare corectă
        if (newPass !== confirmPass) {
            setError('Confirmarea nu coincide cu parola nouă.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/users/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    oldPassword: oldPass,
                    newPassword: newPass,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Eroare la schimbarea parolei.');
            } else {
                setSuccess('Parola a fost schimbată cu succes.');
                setTimeout(() => navigate('/app/profile'), 2000);
            }
        } catch (err) {
            setError('Eroare de rețea sau server.');
        }
    };

    return (
        <div className="reset-wrapper">
            <form className="reset-form" onSubmit={handleSubmit}>
                <h2 className="reset-title">Change Password</h2>

                <label className="reset-label">
                    Old Password
                    <input
                        type="password"
                        className="reset-input"
                        value={oldPass}
                        onChange={(e) => setOldPass(e.target.value)}
                        placeholder="Enter old password"
                        required
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
                        required
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
                        required
                    />
                </label>

                {error && <p className="error-text">{error}</p>}
                {success && <p className="success-text">{success}</p>}

                <button type="submit" className="reset-button">
                    Save Password
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;
