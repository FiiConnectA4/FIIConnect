// src/pages/TwoFactorAuth.jsx
import React, { useState, useEffect } from 'react';
import { Secret, TOTP } from 'otpauth';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import './../styles/Profil.css';

const TwoFactorAuth = () => {
  const navigate = useNavigate();

  const [totpObj, setTotpObj] = useState(null);
  const [uri, setUri] = useState('');
  const [token, setToken] = useState('');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    // Generăm un secret nou și TOTP
    const secret = new Secret(); 
    const totp = new TOTP({
      issuer: 'FIIConnect',
      label: 'sidxx@growthx.com', // în realitate ia-l din context de utilizator
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret,
    });
    setTotpObj(totp);
    setUri(totp.toString()); // acesta este URL-ul otpauth://
  }, []);

  const handleVerify = () => {
    if (!totpObj) return;
    const isValid = totpObj.validate({ token, window: 1 });
    setStatus(isValid);
    // aici ai putea trimite la backend și salva starea 2FA
  };

  return (
    <div className="profile-wrapper">
      <h1 className="profile-title">Two-Factor Authentication</h1>

      <div className="profile-sections">
        <div className="profile-left" style={{ flex: 0 }}>
          <div className="card">
            <p>
              Scan the QR code with an Authenticator app (Google Authenticator, Authy etc.), then enter the code below to verify.
            </p>

            {uri && (
              <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                <QRCodeSVG value={uri} size={180} />
              </div>
            )}

            <p>
              <strong>Secret key:</strong> <code>{totpObj?.secret.base32}</code>
            </p>

            <div className="info-item" style={{ marginTop: '1rem' }}>
              <input
                type="text"
                placeholder="Enter code"
                className="editable-input"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
              <button className="save-btn" onClick={handleVerify}>
                Verify
              </button>
            </div>

            {status === true && (
              <p style={{ color: '#16a34a', marginTop: '1rem' }}>
                ✅ Two-Factor enabled!
              </p>
            )}
            {status === false && (
              <p style={{ color: '#dc2626', marginTop: '1rem' }}>
                ❌ Invalid code, please try again.
              </p>
            )}

            <button
              style={{
                marginTop: '1.5rem',
                background: 'transparent',
                color: '#003087',
                border: 'none',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={() => navigate(-1)}
            >
              ← Back to Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuth;
