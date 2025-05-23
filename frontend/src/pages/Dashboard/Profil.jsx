import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Profil.css";

/**
 * Profile.jsx – componentă completă
 *  • Fetch profil autenticat (GET /profile)
 *  • Dacă lipseşte profilul → redirect /app/setup-profile
 *  • Dacă token invalid → redirect /
 *  • Permite editarea Phone & About, salvează cu PUT /profile
 */
const Profile = () => {
    /* --------------------------- state --------------------------- */
    const API = "http://localhost:34101";
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState({ phone: false, about: false });
    const [draft, setDraft] = useState({ phone: "", about: "" });
    const navigate = useNavigate();

    const handleDisable2FA = async () => {
        const confirm = window.confirm("Sigur vrei să dezactivezi 2FA?");
        if (!confirm) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API}/users/disable-2fa`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to disable 2FA");

            // refacem profilul după dezactivare
            await loadProfile();
        } catch (err) {
            console.error("Eroare la dezactivare 2FA:", err);
            alert("A apărut o problemă la dezactivare.");
        }
    };

    /* -------------------- fetch profil din backend -------------------- */
    const loadProfile = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 404) return navigate("/app/setup-profile");
            if (res.status === 401 || res.status === 403) return navigate("/");
            if (!res.ok) throw new Error("Eroare necunoscută la fetch profil");

            const data = await res.json();
            setProfile(data);
            console.log("Profil primit:", profile);
            setDraft({ phone: data.phone || "", about: data.about || "" });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    /* ------------------------- update profile ------------------------ */
    const updateProfile = async (changes) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(changes),
            });
            if (!res.ok) throw new Error("Update failed");
            const updated = await res.json();
            setProfile(updated);
            setDraft({
                phone: updated.phone || "",
                about: updated.about || "",
            });

        } catch (err) {
            console.error("Eroare la actualizare:", err);
        }
    };


    /* --------------------------- render --------------------------- */
    if (loading) return <div>Loading…</div>;
    if (!profile) return null; // fallback – nu ar trebui să ajungă aici

    return (
        <div className="profile-wrapper">
            <h1 className="profile-title">MY PROFILE</h1>

            <div className="profile-sections">
                {/* ================ LEFT SIDE ================ */}
                <div className="profile-left">
                    {/* CARD PRINCIPAL */}
                    <div className="card profile-main-card">
                        <div className="profile-header">
                            <img
                                src={profile.profilePictureUrl || "/avatar.jpg"}
                                alt="Avatar"
                                className="profile-avatar"
                            />
                            <button className="upload-btn">Upload Photo</button>
                        </div>

                        <div className="info-group">
                            <InfoRow label="Your First Name" value={profile.firstName} />
                            <InfoRow label="Your Last Name" value={profile.lastName} />
                            <InfoRow label="Email" value={profile.email} />

                            {/* PHONE editable */}
                            <div className="info-item">
                                <span className="label">Phone Number</span>
                                {!editing.phone ? (
                                    <div className="value-edit">
                                        <span>{profile.phone}</span>
                                        <button
                                            className="edit-btn"
                                            onClick={() => setEditing((e) => ({ ...e, phone: true }))}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                ) : (
                                    <EditPhoneField
                                        value={draft.phone}
                                        onChange={(v) => setDraft({ ...draft, phone: v })}
                                        onSave={async () => {
                                            await updateProfile({ phone: draft.phone });
                                            setEditing((e) => ({ ...e, phone: false }));
                                        }}
                                        onCancel={() => {
                                            setDraft((d) => ({ ...d, phone: profile.phone }));
                                            setEditing((e) => ({ ...e, phone: false }));
                                        }}
                                    />

                                )}
                            </div>

                            {/* PASSWORD reset */}
                            <div className="info-item">
                                <span className="label">Password</span>
                                <button
                                    className="view-btn"
                                    onClick={() => navigate("/app/reset-password")}
                                >
                                    Reset Password
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ABOUT card */}
                    <div className="card">
                        <div className="info-item header-row">
              <span className="label">
                About <span className="highlight">(Optional)</span>
              </span>
                            {!editing.about ? (
                                <button
                                    className="edit-btn"
                                    onClick={() => setEditing((e) => ({ ...e, about: true }))}
                                >
                                    Edit
                                </button>
                            ) : null}
                        </div>

                        {!editing.about ? (
                            <p className="about-text">{profile.about}</p>
                        ) : (
                            <EditTextarea
                                value={draft.about}
                                onChange={(v) => setDraft({ ...draft, about: v })}
                                onSave={() => {
                                    updateProfile({ about: draft.about });
                                    setEditing((e) => ({ ...e, about: false }));
                                }}
                                onCancel={() => {
                                    setDraft((d) => ({ ...d, about: profile.about }));
                                    setEditing((e) => ({ ...e, about: false }));
                                }}
                            />
                        )}
                    </div>

                    <div className="card">
                        <div className="info-item">
                            <span className="label">Two-Factor Authentication</span>

                            {profile.twoFactorEnabled ? (
                                <>
                                    <span className="enabled-badge">2FA is enabled</span>
                                    <button className="danger-btn" onClick={handleDisable2FA}>
                                        Dezactivează 2FA
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="edit-btn"
                                    onClick={() => navigate("/app/setup-2fa")}
                                >
                                    Activează 2FA
                                </button>
                            )}
                        </div>


                    </div>


                    {/* KYC card */}
                    <div className="card">
                        <InfoRow label="KYC Status" value={<span className="kyc-badge">{profile.kycStatus}</span>} />
                        <InfoRow label="KYC Details" value={<button className="view-btn">View</button>} />
                    </div>

                    {/* Bank */}
                    <div className="card">
                        <InfoRow label="Bank details" value={<button className="view-btn">View</button>} />
                    </div>
                </div>

                {/* ================ RIGHT SIDE ================ */}
                <div className="profile-right">
                    <div className="card status-header">
                        <InfoRow label={<span className="label large">Current Status</span>} value={<span className="status-icon">⭐</span>} />
                    </div>

                    <div className="card">
                        <span className="label">Expertise In</span>
                        <div className="tags spaced">
                            {profile.expertise?.map((tag, i) => (
                                <span key={i} className="tag active">
                  {tag}
                </span>
                            ))}
                        </div>
                    </div>

                    <HorizontalCard
                        outline="orange-outline"
                        label="Current Year"
                        value={profile.currentYear}
                        emoji="🛠"
                    />

                    <HorizontalCard
                        outline="yellow-outline"
                        label="Rating"
                        value={`${profile.rating}/10`}
                        emoji="⭐"
                    />

                    <div className="card achievement-box">
                        <span className="label">Your Achievements</span>
                        <ul className="achievement-list spaced">
                            {profile.achievements?.map((a, i) => (
                                <li key={i}>{a}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* --------------------------- Helpers UI --------------------------- */
const InfoRow = ({ label, value }) => (
    <div className="info-item">
        <span className="label">{label}</span>
        {typeof value === "string" ? <span>{value}</span> : value}
    </div>
);

const EditPhoneField = ({ value, onChange, onSave, onCancel }) => {
    const handleInputChange = (e) => {
        const digitsOnly = e.target.value.replace(/\D/g, "");
        if (digitsOnly.length <= 10) {
            onChange(digitsOnly);
        }
    };

    return (
        <div className="value-edit">
            <input
                type="text"
                className="editable-input"
                value={value}
                onChange={handleInputChange}
                inputMode="numeric"
                maxLength={10}
            />
            <button
                className="save-btn"
                onClick={() => {
                    if (!/^\d{10}$/.test(value)) {
                        alert("Numărul trebuie să aibă exact 10 cifre.");
                        return;
                    }
                    onSave();
                }}
            >
                Save
            </button>
            <button className="cancel-btn" onClick={onCancel}>
                Cancel
            </button>
        </div>
    );
};


const EditTextarea = ({ value, onChange, onSave, onCancel }) => (
    <div className="edit-textarea-wrapper">
    <textarea
        className="about-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
    />
        <div className="edit-actions">
            <button className="save-btn" onClick={onSave}>
                Save
            </button>
            <button className="cancel-btn" onClick={onCancel}>
                Cancel
            </button>
        </div>
    </div>
);

const HorizontalCard = ({ outline, label, value, emoji }) => (
    <div className={`card horizontal-card ${outline}`}>
        <div className="horizontal-content">
            <div>
                <span className="label">{label}</span>
                <p className="value-text">{value}</p>
            </div>
            <div className="emoji-box">{emoji}</div>
        </div>
    </div>
);

export default Profile;
