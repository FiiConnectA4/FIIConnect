// src/pages/Profil.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../styles/Profil.css';

const Profil = () => {
  // Date statice
  const firstName = 'Sid';
  const lastName = 'Bob';
  const email = 'sidxx@growthx.com';

  // Phone editable
  const [phone, setPhone] = useState('+91 49652845732');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [tempPhone, setTempPhone] = useState(phone);

  const handlePhoneSave = () => {
    setPhone(tempPhone);
    setIsEditingPhone(false);
  };
  const handlePhoneCancel = () => {
    setTempPhone(phone);
    setIsEditingPhone(false);
  };

  // About editable (rămâne ca înainte)
  const [about, setAbout] = useState(
    'Lorem ipsum dolor sit amet consectetur. Erat auctor a aliquam vel congue luctus. Leo diam cras neque mauris ac arcu elit ipsum dolor sit amet consectetur.'
  );
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [tempAbout, setTempAbout] = useState(about);

  const handleAboutSave = () => {
    setAbout(tempAbout);
    setIsEditingAbout(false);
  };
  const handleAboutCancel = () => {
    setTempAbout(about);
    setIsEditingAbout(false);
  };

  const navigate = useNavigate();

  return (
    <div className="profile-wrapper">
      <h1 className="profile-title">MY PROFILE</h1>

      <div className="profile-sections">
        {/* Left side */}
        <div className="profile-left">
          {/* Main info card */}
          <div className="card profile-main-card">
            <div className="profile-header">
              <img src="/avatar.jpg" alt="Avatar" className="profile-avatar" />
              <button className="upload-btn">Upload Photo</button>
            </div>

            <div className="info-group">
              {/* First Name (static) */}
              <div className="info-item">
                <span className="label">Your First Name</span>
                <span>{firstName}</span>
              </div>

              {/* Last Name (static) */}
              <div className="info-item">
                <span className="label">Your Last Name</span>
                <span>{lastName}</span>
              </div>

              {/* Email (static) */}
              <div className="info-item">
                <span className="label">Email</span>
                <span>{email}</span>
              </div>

              {/* Phone (editable) */}
              <div className="info-item">
                <span className="label">Phone Number</span>
                {!isEditingPhone ? (
                  <div className="value-edit">
                    <span>{phone}</span>
                    <button
                      className="edit-btn"
                      onClick={() => setIsEditingPhone(true)}
                    >
                      Edit
                    </button>
                  </div>
                ) : (
                  <div className="value-edit">
                    <input
                      type="text"
                      className="editable-input"
                      value={tempPhone}
                      onChange={(e) => setTempPhone(e.target.value)}
                    />
                    <button className="save-btn" onClick={handlePhoneSave}>
                      Save
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={handlePhoneCancel}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Password (reset) */}
              <div className="info-item">
                <span className="label">Password</span>
                <button
                  className="view-btn"
                  onClick={() => navigate('/app/reset-password')}
                >
                  Reset Password
                </button>
              </div>
            </div>
          </div>

          {/* About card */}
          <div className="card">
            <div className="info-item header-row">
              <span className="label">
                About <span className="highlight">(Optional)</span>
              </span>
              {!isEditingAbout ? (
                <button
                  className="edit-btn"
                  onClick={() => setIsEditingAbout(true)}
                >
                  Edit
                </button>
              ) : (
                <div className="edit-actions">
                  <button
                    className="save-btn"
                    onClick={handleAboutSave}
                  >
                    Save
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={handleAboutCancel}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            {!isEditingAbout ? (
              <p className="about-text">{about}</p>
            ) : (
              <textarea
                className="about-textarea"
                value={tempAbout}
                onChange={(e) => setTempAbout(e.target.value)}
              />
            )}
          </div>

          {/* Two-Factor Authentication toggle */}
          <div className="card">
            <div className="info-item">
              <span className="label">Two-Factor Authentication</span>
              <button
                className="edit-btn"
                onClick={() => navigate('/app/2fa')}
              >
                Enable 2FA
              </button>
            </div>
          </div>

          {/* KYC card */}
          <div className="card">
            <div className="info-item">
              <span className="label">KYC Status</span>
              <span className="kyc-badge">Verified</span>
            </div>
            <div className="info-item">
              <span className="label">KYC Details</span>
              <button className="view-btn">View</button>
            </div>
          </div>

          {/* Bank details card */}
          <div className="card">
            <div className="info-item">
              <span className="label">Bank details</span>
              <button className="view-btn">View</button>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="profile-right">
          {/* Current Status header */}
          <div className="card status-header">
            <div className="info-item">
              <span className="label large">Current Status</span>
              <span className="status-icon">⭐</span>
            </div>
          </div>

          {/* Expertise */}
          <div className="card">
            <span className="label">Expertise In</span>
            <div className="tags spaced">
              <span className="tag active">SGBD</span>
              <span className="tag active">AIIT</span>
              <span className="tag">IP</span>
              <span className="tag">PA</span>
            </div>
          </div>

          {/* Current Year */}
          <div className="card horizontal-card orange-outline">
            <div className="horizontal-content">
              <div>
                <span className="label">Current Year</span>
                <p className="value-text">2nd (Bachelor)</p>
              </div>
              <div className="emoji-box">🛠</div>
            </div>
          </div>

          {/* Rating */}
          <div className="card horizontal-card yellow-outline">
            <div className="horizontal-content">
              <div>
                <span className="label">Rating</span>
                <p className="value-text">9.1/10</p>
              </div>
              <div className="emoji-box">⭐</div>
            </div>
          </div>

          {/* Achievements */}
          <div className="card achievement-box">
            <span className="label">Your Achievements</span>
            <ul className="achievement-list spaced">
              <li>Best graded student this semester.</li>
              <li>Best graded student this semester.</li>
              <li>Best graded student this semester.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;
