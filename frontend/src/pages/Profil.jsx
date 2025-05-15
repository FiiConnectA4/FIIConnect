import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "./../styles/Profil.css";

const BACKEND_URL = "http://localhost:34101"; // modifică dacă ai alt port

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState({ phone: false, about: false });
    const [draft, setDraft] = useState({ phone: "", about: "" });
    const [photoFile, setPhotoFile] = useState(null);
    const [photoUrl, setPhotoUrl] = useState(null);
    const [photoError, setPhotoError] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const navigate = useNavigate();

    // Funcție pentru reîmprospătarea imaginii de profil
    const refreshProfileImage = useCallback(() => {
        // Verificați dacă profilul există și are o imagine
        if (profile && profile.profilePicture) {
            const timestamp = Date.now();
            setPhotoUrl(`${BACKEND_URL}/profile/photo?t=${timestamp}`);
            setPhotoError(false);
        } else {
            // Setează un URL de placeholder sau setează eroarea
            setPhotoError(true);
        }
    }, [profile]);

    const loadProfile = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found!");
                navigate("/");
                return;
            }

            console.log("Fetching profile with token:", token.substring(0, 10) + "...");

            const res = await fetch(`${BACKEND_URL}/profile`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });

            console.log("Profile response status:", res.status);

            if (res.status === 404) return navigate("/app/setup-profile");
            if (res.status === 401 || res.status === 403) {
                console.error("Authentication error:", res.status);
                return navigate("/");
            }

            if (!res.ok) {
                const errorText = await res.text();
                console.error("Profile fetch error:", errorText);
                throw new Error(`Eroare la fetch profil: ${res.status} ${errorText}`);
            }

            const data = await res.json();
            console.log("Profile data received:", data);

            setProfile(data);
            setDraft({
                phone: data.phone || "",
                about: data.about || ""
            });

            // După ce profilul e încărcat, actualizăm URL-ul imaginii
            // Amânăm acest lucru pentru a asigura că profilul e setat
            setTimeout(() => {
                if (data && data.profilePicture) {
                    setPhotoUrl(`${BACKEND_URL}/profile/photo?t=${Date.now()}`);
                    setPhotoError(false);
                } else {
                    setPhotoError(true);
                }
            }, 100);

        } catch (err) {
            console.error("Profile loading error:", err);
            setUploadError(err.message);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    // Efect separat pentru reîmprospătarea imaginii când profilul se schimbă
    useEffect(() => {
        if (profile) {
            refreshProfileImage();
        }
    }, [profile, refreshProfileImage]);

    const updateProfile = async (changes) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found!");
                navigate("/");
                return;
            }

            console.log("Updating profile with:", changes);

            const res = await fetch(`${BACKEND_URL}/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    ...changes
                })
            });

            console.log("Update response status:", res.status);

            if (!res.ok) {
                const errorText = await res.text();
                console.error("Update error:", errorText);
                throw new Error(`Update failed: ${res.status} ${errorText}`);
            }

            await loadProfile(); // reload profile after update
        } catch (err) {
            console.error("Eroare la actualizare:", err);
            alert("Actualizare eșuată: " + err.message);
        }
    };

    const uploadPhoto = async () => {
        if (!photoFile) return;
        setUploadError(null);

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No authentication token found");

            // ✅ FOARTE IMPORTANT: folosim FormData + axios (nu fetch!)
            const formData = new FormData();
            formData.append("file", photoFile);

            await axios.post(`${BACKEND_URL}/profile/photo`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    // ⚠️ axios setează automat Content-Type + boundary corect
                },
                withCredentials: true // (dacă ai Spring Security strict pe cookies)
            });

            // resetează fișierul
            setPhotoFile(null);
            await loadProfile();

            // refresh after short delay
            setTimeout(() => {
                refreshProfileImage();
            }, 1000);

        } catch (err) {
            console.error("Upload error:", err);
            setUploadError(err.response?.data || err.message);
        }
    };

    const handleImageError = () => {
        console.log("Image failed to load");
        setPhotoError(true);
    };

    if (loading) return <div>Loading…</div>;
    if (!profile) return null;

    return (
        <div className="profile-wrapper">
            <h1 className="profile-title">MY PROFILE</h1>

            {uploadError && (
                <div className="error-message">
                    Eroare: {uploadError}
                </div>
            )}

            <div className="profile-sections">
                <div className="profile-left">
                    <div className="card profile-main-card">
                        <div className="profile-header">
                            {photoError ? (
                                <div className="profile-avatar no-image">
                                    No Image
                                </div>
                            ) : (
                                <img
                                    src={photoUrl}
                                    alt="Avatar"
                                    className="profile-avatar"
                                    onError={handleImageError}
                                />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        console.log("File selected:", e.target.files[0].name);
                                        setPhotoFile(e.target.files[0]);
                                    }
                                }}
                                style={{ display: "none" }}
                                id="fileInput"
                            />
                            <label htmlFor="fileInput" className="upload-btn">Choose Photo</label>
                            {photoFile && (
                                <button className="upload-btn" onClick={uploadPhoto}>
                                    Upload
                                </button>
                            )}
                        </div>

                        <div className="info-group">
                            <InfoRow label="Your First Name" value={profile.firstName} />
                            <InfoRow label="Your Last Name" value={profile.lastName} />
                            <InfoRow label="Email" value={profile.email} />

                            <div className="info-item">
                                <span className="label">Phone Number</span>
                                {!editing.phone ? (
                                    <div className="value-edit">
                                        <span>{profile.phone}</span>
                                        <button
                                            className="edit-btn"
                                            onClick={() => setEditing(e => ({ ...e, phone: true }))}
                                        >Edit</button>
                                    </div>
                                ) : (
                                    <EditField
                                        type="text"
                                        value={draft.phone}
                                        onChange={(v) => setDraft({ ...draft, phone: v })}
                                        onSave={() => {
                                            updateProfile({ phone: draft.phone });
                                            setEditing(e => ({ ...e, phone: false }));
                                        }}
                                        onCancel={() => {
                                            setDraft(d => ({ ...d, phone: profile.phone || "" }));
                                            setEditing(e => ({ ...e, phone: false }));
                                        }}
                                    />
                                )}
                            </div>

                            <div className="info-item">
                                <span className="label">Password</span>
                                <button className="view-btn" onClick={() => navigate("/app/reset-password")}>
                                    Reset Password
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Restul componentei rămâne neschimbat */}
                    {/* ... */}
                    <div className="card">
                        <div className="info-item header-row">
                            <span className="label">About <span className="highlight">(Optional)</span></span>
                            {!editing.about && (
                                <button
                                    className="edit-btn"
                                    onClick={() => setEditing(e => ({ ...e, about: true }))}
                                >Edit</button>
                            )}
                        </div>

                        {!editing.about ? (
                            <p className="about-text">{profile.about}</p>
                        ) : (
                            <EditTextarea
                                value={draft.about}
                                onChange={(v) => setDraft({ ...draft, about: v })}
                                onSave={() => {
                                    updateProfile({ about: draft.about });
                                    setEditing(e => ({ ...e, about: false }));
                                }}
                                onCancel={() => {
                                    setDraft(d => ({ ...d, about: profile.about || "" }));
                                    setEditing(e => ({ ...e, about: false }));
                                }}
                            />
                        )}
                    </div>

                    <div className="card">
                        <div className="info-item">
                            <span className="label">Two-Factor Authentication</span>
                            <button
                                className="edit-btn"
                                onClick={() => navigate("/app/setup-2fa")}
                            >{profile.twoFactorEnabled ? "Manage 2FA" : "Enable 2FA"}</button>
                        </div>
                    </div>

                    <div className="card">
                        <InfoRow label="KYC Status" value={<span className="kyc-badge">{profile.kycStatus}</span>} />
                        <InfoRow label="KYC Details" value={<button className="view-btn">View</button>} />
                    </div>

                    <div className="card">
                        <InfoRow label="Bank details" value={<button className="view-btn">View</button>} />
                    </div>
                </div>

                <div className="profile-right">
                    <div className="card status-header">
                        <InfoRow label={<span className="label large">Current Status</span>}
                                 value={<span className="status-icon">⭐</span>} />
                    </div>

                    <div className="card">
                        <span className="label">Expertise In</span>
                        <div className="tags spaced">
                            {profile.expertise?.map((tag, i) => (
                                <span key={i} className="tag active">{tag}</span>
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

const InfoRow = ({ label, value }) => (
    <div className="info-item">
        <span className="label">{label}</span>
        {typeof value === "string" ? <span>{value}</span> : value}
    </div>
);

const EditField = ({ type, value, onChange, onSave, onCancel }) => (
    <div className="value-edit">
        <input
            type={type}
            className="editable-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
        <button className="save-btn" onClick={onSave}>Save</button>
        <button className="cancel-btn" onClick={onCancel}>Cancel</button>
    </div>
);

const EditTextarea = ({ value, onChange, onSave, onCancel }) => (
    <div className="edit-textarea-wrapper">
        <textarea
            className="about-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
        <div className="edit-actions">
            <button className="save-btn" onClick={onSave}>Save</button>
            <button className="cancel-btn" onClick={onCancel}>Cancel</button>
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
