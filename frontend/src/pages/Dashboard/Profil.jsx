import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "../../styles/Profil.css";

const BACKEND_URL = "http://localhost:34101"; // modifică dacă ai alt port

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState({ phone: false, about: false });
    const [draft, setDraft] = useState({ phone: "", about: "" });
    const [photoFile, setPhotoFile] = useState(null);
    const [photoUrl, setPhotoUrl] = useState(null);
    const [photoError, setPhotoError] = useState("");
    const [uploadError, setUploadError] = useState(null);
    const navigate = useNavigate();

    // Funcție pentru reîmprospătarea imaginii de profil
    const refreshProfileImage = useCallback(() => {
        if (profile && profile.profilePicture) {
            const timestamp = Date.now();
            setPhotoUrl(`${BACKEND_URL}/profile/photo?t=${timestamp}`);
            setPhotoError("");
        } else {
            setPhotoError("No profile picture available");
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

            const res = await fetch(`${BACKEND_URL}/profile`, {
                headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
            });

            if (res.status === 404) return navigate("/app/setup-profile");
            if (res.status === 401 || res.status === 403) {
                console.error("Authentication error:", res.status);
                return navigate("/");
            }

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`Profile fetch failed: ${res.status} ${errText}`);
            }

            const data = await res.json();
            setProfile(data);
            setDraft({ phone: data.phone || "", about: data.about || "" });

        } catch (err) {
            console.error("Profile loading error:", err);
            setUploadError(err.message); // Potențial ar trebui un alt state de eroare generală
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    // Încarcă poza de profil cu error handling explicit
    useEffect(() => {
        if (!profile || !profile.profilePicture) return;
        const token = localStorage.getItem("token");
        if (!token) {
            setPhotoError("No auth token");
            return;
        }
        fetch(`${BACKEND_URL}/profile/photo?t=${Date.now()}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                if (res.status === 403) {
                    setPhotoError("Access forbidden (403)");
                    return null;
                }
                if (!res.ok) {
                    setPhotoError(`HTTP error: ${res.status}`);
                    return null;
                }
                return res.blob();
            })
            .then(blob => {
                if (blob) {
                    setPhotoUrl(URL.createObjectURL(blob));
                }
            })
            .catch(err => {
                console.error("Error fetching profile photo:", err);
                setPhotoError(err.message);
            });
    }, [profile]);

    const updateProfile = async (changes) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return navigate("/");
            const res = await fetch(`${BACKEND_URL}/profile`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ firstName: profile.firstName, lastName: profile.lastName, ...changes })
            });
            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`Update failed: ${res.status} ${errText}`);
            }
            await loadProfile();
        } catch (err) {
            console.error("Update error:", err);
            alert("Actualizare eșuată: " + err.message);
        }
    };

    const uploadPhoto = async () => {
        if (!photoFile) return;
        setUploadError(null);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No auth token");
            const formData = new FormData();
            formData.append("file", photoFile);
            const res = await axios.post(
                `${BACKEND_URL}/profile/photo`, formData,
                { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
            );
            setPhotoFile(null);
            // Nu mai apelăm refreshProfileImage, loadProfile ar trebui să fie suficient
            // și va re-rula useEffect-ul pentru poză dacă e cazul.
            await loadProfile();
        } catch (err) {
            console.error("Upload error:", err);
            setUploadError(err.response?.data || err.message);
        }
    };

    // Funcția pentru dezactivarea 2FA
    const handleDisable2FA = useCallback(async () => {
        if (!window.confirm("Sunteți sigur că doriți să dezactivați autentificarea cu doi factori?")) {
            return;
        }
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Token de autentificare negăsit. Vă rugăm să vă autentificați din nou.");
                navigate("/");
                return;
            }

            const res = await fetch(`${BACKEND_URL}/users/disable-2fa`, {
                method: "POST", // Majoritatea acțiunilor de tip 'disable' folosesc POST sau DELETE
                headers: {
                    "Authorization": `Bearer ${token}`,
                    // "Content-Type": "application/json", // De obicei nu e necesar pentru un simplu POST de disable fără body
                }
            });

            if (res.status === 401 || res.status === 403) {
                alert("Eroare de autentificare sau autorizare. Vă rugăm să vă autentificați din nou.");
                navigate("/");
                return;
            }

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`Dezactivarea 2FA a eșuat: ${res.status} ${errText || 'Eroare necunoscută'}`);
            }

            alert("Autentificarea cu doi factori a fost dezactivată cu succes.");
            await loadProfile(); // Reîncarcă profilul pentru a reflecta schimbarea stării 2FA

        } catch (err) {
            console.error("Eroare la dezactivarea 2FA:", err);
            alert("Eroare la dezactivarea 2FA: " + err.message);
        }
    }, [navigate, loadProfile]);


    const handleImageError = () => {
        console.log("Image load failed");
        setPhotoError("Failed to load image");
    };

    if (loading) return <div>Loading…</div>;
    if (!profile) return null; // Sau un mesaj mai prietenos, ex: "Profilul nu a putut fi încărcat."

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
                                    {photoError === "No profile picture available" ? "No Image" : "Error"}
                                </div>
                            ) : (
                                <img
                                    src={photoUrl}
                                    alt="Avatar"
                                    className="profile-avatar"
                                    onError={handleImageError} // S-ar putea să vrei să folosești refreshProfileImage aici sau alt mecanism
                                />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        console.log("File selected:", e.target.files[0].name);
                                        setPhotoFile(e.target.files[0]);
                                        // O previzualizare instantanee ar putea fi utilă aici
                                        // setPhotoUrl(URL.createObjectURL(e.target.files[0]));
                                        // setPhotoError(""); // Resetează eroarea dacă o imagine nouă e selectată
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
                                        <span>{profile.phone || "-"}</span>
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
                            <p className="about-text">{profile.about || "N/A"}</p>
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
                                className="edit-btn" // Poate redenumi în 'action-btn' sau similar
                                onClick={() => navigate("/app/setup-2fa")}
                            >{profile.twoFactorEnabled ? "Manage 2FA" : "Enable 2FA"}</button>
                            {profile.twoFactorEnabled && (
                                <button
                                    className="edit-btn" // Sau o clasă specifică gen 'warning-btn' sau 'disable-btn'
                                    onClick={handleDisable2FA}
                                    style={{ marginLeft: '10px' }} // Adaugă un mic spațiu
                                >
                                    Disable 2FA
                                </button>
                            )}
                        </div>
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
                        value={`${profile.rating || "N/A"}/10`}
                        emoji="⭐"
                    />

                    <div className="card achievement-box">
                        <span className="label">Your Achievements</span>
                        <ul className="achievement-list spaced">
                            {profile.achievements?.length > 0 ? profile.achievements.map((a, i) => (
                                <li key={i}>{a}</li>
                            )) : <li>No achievements yet.</li>}
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
            rows={4} // Adaugă un număr de rânduri default
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
            {emoji && <div className="emoji-box">{emoji}</div>}
        </div>
    </div>
);

export default Profile;