// src/pages/Profile/Profil.jsx (sau unde îl ai tu)
import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios'; // Pentru upload-ul de fișiere
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Dacă vrei să decodezi token-ul local pentru roluri etc.
import "../../styles/Profil.css"; // Asigură-te că ai și un fișier Profil.css

// Configurează URL-ul backend-ului tău. Ideal, ar fi într-o variabilă de mediu.
const BACKEND_URL = "http://localhost:34101"; // Sau portul tău: 8080, 3001 etc.

// Componente Helper UI (pot fi mutate în fișiere separate dacă sunt refolosite)
const InfoRow = ({ label, value }) => (
    <div className="info-item">
        <span className="label">{label}</span>
        {/* Verifică dacă value este un string pentru a-l încadra în span, altfel randează direct (ex: un alt element JSX) */}
        {typeof value === "string" ? <span>{value || "-"}</span> : value}
    </div>
);

const EditField = ({ type = "text", value, onChange, onSave, onCancel, inputMode, maxLength, placeholder }) => (
    <div className="value-edit">
        <input
            type={type}
            className="editable-input"
            value={value}
            onChange={(e) => {
                if (type === "tel") { // Validare specifică pentru numărul de telefon
                    const digitsOnly = e.target.value.replace(/\D/g, "");
                    if (digitsOnly.length <= 10) {
                        onChange(digitsOnly);
                    }
                } else {
                    onChange(e.target.value);
                }
            }}
            inputMode={inputMode}
            maxLength={maxLength}
            placeholder={placeholder}
        />
        <button className="save-btn" onClick={() => {
            if (type === "tel" && value && !/^\d{10}$/.test(value)) {
                alert("Numărul de telefon trebuie să conțină exact 10 cifre.");
                return;
            }
            onSave();
        }}>Save</button>
        <button className="cancel-btn" onClick={onCancel}>Cancel</button>
    </div>
);

const EditTextarea = ({ value, onChange, onSave, onCancel, placeholder }) => (
    <div className="edit-textarea-wrapper">
        <textarea
            className="about-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
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
                <p className="value-text">{value || "-"}</p>
            </div>
            {emoji && <div className="emoji-box">{emoji}</div>}
        </div>
    </div>
);


const Profile = () => {
    // --- State-uri Locale ---
    const [profile, setProfile] = useState(null); // Datele profilului de la backend
    const [loading, setLoading] = useState(true); // Indicator de încărcare
    const [editing, setEditing] = useState({ phone: false, about: false }); // Ce câmpuri sunt în modul de editare
    const [draft, setDraft] = useState({ phone: "", about: "" }); // Valorile temporare din câmpurile de editare

    const [photoFile, setPhotoFile] = useState(null); // Fișierul selectat pentru upload (poză profil)
    const [photoUrl, setPhotoUrl] = useState(null);   // URL-ul pozei de profil afișate (cu timestamp pentru refresh)
    const [photoError, setPhotoError] = useState(false); // Dacă încărcarea pozei a eșuat
    const [uploadError, setUploadError] = useState(null); // Mesaj de eroare general pentru upload sau update

    const navigate = useNavigate();

    // --- Funcții pentru Datele Profilului ---
    const loadProfile = useCallback(async () => {
        console.log("Attempting to load profile...");
        setLoading(true);
        setUploadError(null); // Resetează eroarea anterioară la reîncărcare
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found, navigating to login.");
                navigate("/"); // Sau la pagina ta de login, ex: /login
                return;
            }

            const response = await fetch(`${BACKEND_URL}/profile`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json" // Specifică că aștepți JSON
                }
            });

            console.log("Profile fetch response status:", response.status);

            if (response.status === 404) {
                console.log("Profile not found (404), navigating to setup-profile.");
                navigate("/app/setup-profile"); // Redirecționează dacă profilul nu există încă
                return;
            }
            if (response.status === 401 || response.status === 403) {
                console.error("Authentication/Authorization error (" + response.status + "), navigating to login.");
                localStorage.removeItem("token"); // Elimină token-ul invalid
                navigate("/"); // Sau la pagina ta de login
                return;
            }
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Failed to fetch profile:", response.status, errorText);
                throw new Error(`Eroare la preluarea profilului: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log("Profile data received from backend:", data);
            setProfile(data);
            // Inițializează draft-urile pentru editare cu valorile curente din profil
            setDraft({
                phone: data.phone || "",
                about: data.about || ""
            });

            // Setează URL-ul pozei de profil (cu timestamp pentru a forța refresh-ul din cache)
            if (data.profilePictureUrl) { // Presupunând că backend-ul returnează direct URL-ul
                setPhotoUrl(`${data.profilePictureUrl}?t=${Date.now()}`);
                setPhotoError(false);
            } else if (data.profilePicture) { // Compatibilitate cu primul tău exemplu care sugera un endpoint generic /profile/photo
                setPhotoUrl(`${BACKEND_URL}/profile/photo?t=${Date.now()}`);
                setPhotoError(false);
            } else {
                setPhotoUrl(null); // Nu există poză
                setPhotoError(true); // Pentru a afișa un placeholder
            }

        } catch (err) {
            console.error("Error loading profile:", err);
            setUploadError("Nu s-a putut încărca profilul: " + err.message);
        } finally {
            setLoading(false);
        }
    }, [navigate]); // navigate este o dependență stabilă

    // Efect pentru încărcarea profilului la montarea componentei
    useEffect(() => {
        loadProfile();
    }, [loadProfile]); // loadProfile este acum în useCallback, deci referința e stabilă

    // Funcție pentru actualizarea parțială a profilului
    const handleUpdateProfileField = async (fieldToUpdate) => {
        setUploadError(null);
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }

        // Construiește obiectul `changes` doar cu câmpurile relevante
        let changes = {};
        if (fieldToUpdate.hasOwnProperty('phone')) changes.phone = fieldToUpdate.phone;
        if (fieldToUpdate.hasOwnProperty('about')) changes.about = fieldToUpdate.about;

        // Nu trimite request dacă nu sunt modificări efective (deși draft-ul ar trebui să fie diferit)
        if (Object.keys(changes).length === 0) {
            console.log("Nicio modificare de trimis pentru updateProfile.");
            // Resetează starea de editare pentru câmpurile nemodificate
            if (fieldToUpdate.hasOwnProperty('phone')) setEditing(e => ({ ...e, phone: false }));
            if (fieldToUpdate.hasOwnProperty('about')) setEditing(e => ({ ...e, about: false }));
            return;
        }

        console.log("Updating profile with changes:", changes);

        try {
            const response = await fetch(`${BACKEND_URL}/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                },
                // Trimite doar câmpurile care se modifică, plus cele necesare pentru identificare/validare pe backend
                // Backend-ul ar trebui să știe cum să gestioneze actualizările parțiale.
                // Dacă backend-ul necesită tot obiectul UserProfile, atunci trebuie să trimiți {...profile, ...changes}
                // dar asigură-te că nu suprascrii neintenționat alte câmpuri.
                // Pentru simplitate, trimitem doar ce s-a modificat explicit plus identificatori dacă sunt necesari.
                // Presupunem că backend-ul actualizează doar câmpurile primite în 'changes'.
                body: JSON.stringify(changes)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: "Eroare necunoscută la actualizare." }));
                console.error("Profile update failed:", response.status, errorData);
                throw new Error(errorData.message || `Actualizarea profilului a eșuat cu status ${response.status}`);
            }

            const updatedProfileData = await response.json();
            console.log("Profile updated successfully, new data:", updatedProfileData);

            // Actualizează starea locală cu datele complete returnate de backend după update
            setProfile(prevProfile => ({...prevProfile, ...updatedProfileData}));
            setDraft({ // Resetează draft-ul cu noile valori
                phone: updatedProfileData.phone || "",
                about: updatedProfileData.about || ""
            });
            // Închide modul de editare pentru câmpul/câmpurile actualizate
            if (changes.hasOwnProperty('phone')) setEditing(e => ({ ...e, phone: false }));
            if (changes.hasOwnProperty('about')) setEditing(e => ({ ...e, about: false }));

        } catch (err) {
            console.error("Eroare la actualizarea profilului:", err);
            setUploadError("Actualizarea profilului a eșuat: " + err.message);
            // Nu reseta draft-ul la eroare, pentru ca utilizatorul să poată reîncerca
        }
    };

    // --- Funcții pentru Poza de Profil ---
    const handlePhotoFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            // TODO: Adaugă validare pentru dimensiunea și tipul fișierului aici, pe client
            // de ex. if (file.size > 2 * 1024 * 1024) { alert("Fișier prea mare!"); return; }
            setPhotoFile(file);
            setUploadError(null); // Resetează eroarea de upload
            // Opțional: afișează un preview local al imaginii înainte de upload
            // setPhotoUrl(URL.createObjectURL(file));
        }
    };

    const handleUploadPhoto = async () => {
        if (!photoFile) {
            setUploadError("Selectează mai întâi o imagine.");
            return;
        }
        setLoading(true); // Arată un indicator de încărcare pentru upload
        setUploadError(null);

        const formData = new FormData();
        formData.append("file", photoFile); // Cheia "file" trebuie să corespundă cu ce așteaptă backend-ul

        const token = localStorage.getItem("token");
        if (!token) {
            setUploadError("Autentificare necesară pentru upload.");
            setLoading(false);
            navigate("/");
            return;
        }

        try {
            const response = await axios.post(`${BACKEND_URL}/profile/photo`, formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    // 'Content-Type' va fi setat automat de axios la 'multipart/form-data' cu boundary corect
                },
                // withCredentials: true, // Necesar doar dacă folosești intensiv cookies pentru sesiune și CORS e strict
            });

            console.log("Photo upload response:", response.data);
            setPhotoFile(null); // Resetează selecția fișierului

            // Reîncarcă profilul pentru a prelua noua cale a pozei și a actualiza UI-ul
            // Sau, dacă backend-ul returnează noul URL al pozei, folosește-l direct.
            // Presupunem că loadProfile va actualiza photoUrl.
            await loadProfile(); // Aceasta va apela și refreshProfileImage prin useEffect

        } catch (err) {
            console.error("Photo upload error:", err.response || err);
            setUploadError(err.response?.data?.message || err.response?.data || err.message || "Eroare la încărcarea pozei.");
        } finally {
            setLoading(false);
        }
    };

    // Handler pentru cazul în care imaginea nu se încarcă (ex: URL invalid, eroare server)
    const handleImageError = () => {
        console.warn("Imaginea de profil nu s-a putut încărca de la URL:", photoUrl);
        setPhotoError(true); // Setează pentru a afișa un placeholder sau mesaj
    };


    // --- Funcții pentru 2FA ---
    const handleDisable2FA = async () => {
        if (!window.confirm("Sigur dorești să dezactivezi Autentificarea cu Doi Factori?")) {
            return;
        }
        setLoading(true);
        setUploadError(null);
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`${BACKEND_URL}/users/disable-2fa`, { // Asigură-te că endpoint-ul e corect
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: "Eroare la server" }));
                throw new Error(errorData.message || "Nu s-a putut dezactiva 2FA.");
            }
            console.log("2FA disabled successfully.");
            // Reîncarcă datele profilului pentru a reflecta schimbarea statusului 2FA
            await loadProfile();
            alert("Autentificarea cu Doi Factori a fost dezactivată cu succes.");

        } catch (err) {
            console.error("Eroare la dezactivarea 2FA:", err);
            setUploadError("Dezactivarea 2FA a eșuat: " + err.message);
            alert("A apărut o problemă la dezactivarea 2FA: " + err.message);
        } finally {
            setLoading(false);
        }
    };


    // --- Randare Componentă ---
    if (loading && !profile) { // Afișează loading doar la încărcarea inițială a profilului
        return <div className="status-message loading"><p>Se încarcă profilul...</p></div>;
    }

    // Dacă a apărut o eroare majoră la loadProfile și profilul e null
    if (!profile && uploadError) {
        return (
            <div className="profile-wrapper">
                <div className="status-message error">
                    <p>{uploadError}</p>
                    <button className="main-btn" onClick={() => navigate("/app/dashboard")}>Înapoi la Dashboard</button>
                </div>
            </div>
        );
    }

    // Fallback dacă profilul tot nu s-a încărcat (caz puțin probabil dacă loading e false și nu e eroare majoră)
    if (!profile) return <div>Nu s-au putut încărca datele profilului.</div>;


    return (
        <div className="profile-wrapper">
            <h1 className="profile-title">PROFILUL MEU</h1>

            {/* Afișează eroarea de upload/update deasupra, dacă există */}
            {uploadError && !loading && (
                <div className="error-message api-error">
                    <p>Eroare: {uploadError}</p>
                    <button onClick={() => setUploadError(null)}>Închide</button>
                </div>
            )}
            {/* Indicator de încărcare global pentru acțiuni (upload, update, disable 2FA) */}
            {loading && <div className="status-message loading inline-loader"><p>Se procesează...</p></div>}


            <div className="profile-sections">
                {/* --- Secțiunea Stânga: Informații Principale, Editabile --- */}
                <div className="profile-left">
                    <div className="card profile-main-card">
                        <div className="profile-header">
                            {/* Afișare Poză de Profil sau Placeholder */}
                            {photoError || !photoUrl ? (
                                <div className="profile-avatar no-image"><span>Fără Imagine</span></div>
                            ) : (
                                <img
                                    key={photoUrl} // Adaugă key pentru a forța re-randarea la schimbarea URL-ului
                                    src={photoUrl}
                                    alt="Avatar"
                                    className="profile-avatar"
                                    onError={handleImageError} // Gestionează eroarea dacă imaginea nu se încarcă
                                />
                            )}
                            {/* Input pentru selectarea fișierului (ascuns vizual, activat de label) */}
                            <input
                                type="file"
                                accept="image/png, image/jpeg, image/gif" // Specifică tipurile de fișiere acceptate
                                onChange={handlePhotoFileChange}
                                style={{ display: "none" }}
                                id="fileInput"
                                ref={input => input && photoFile === null && (input.value = null)} // Resetează input-ul după upload
                            />
                            {/* Buton pentru a deschide dialogul de selecție fișier */}
                            <label htmlFor="fileInput" className="upload-btn choose-photo-btn">Schimbă Poza</label>
                            {/* Buton pentru a face upload la poza selectată */}
                            {photoFile && (
                                <button className="upload-btn confirm-upload-btn" onClick={handleUploadPhoto} disabled={loading}>
                                    {loading ? "Se încarcă..." : "Încarcă Poza"}
                                </button>
                            )}
                        </div>

                        <div className="info-group">
                            <InfoRow label="Prenume" value={profile.firstName} />
                            <InfoRow label="Nume" value={profile.lastName} />
                            <InfoRow label="Email" value={profile.email} />

                            {/* Editare Număr de Telefon */}
                            <div className="info-item">
                                <span className="label">Număr Telefon</span>
                                {!editing.phone ? (
                                    <div className="value-edit">
                                        <span>{profile.phone || "Nespecificat"}</span>
                                        <button
                                            className="edit-btn"
                                            onClick={() => {
                                                setDraft(d => ({ ...d, phone: profile.phone || "" }));
                                                setEditing(e => ({ ...e, phone: true, about: false }));
                                            }}
                                        >Modifică</button>
                                    </div>
                                ) : (
                                    <EditField
                                        type="tel" // input type 'tel' pentru telefoane
                                        value={draft.phone}
                                        onChange={(v) => setDraft({ ...draft, phone: v })}
                                        onSave={() => handleUpdateProfileField({ phone: draft.phone })}
                                        onCancel={() => {
                                            setDraft(d => ({ ...d, phone: profile.phone || "" }));
                                            setEditing(e => ({ ...e, phone: false }));
                                        }}
                                        inputMode="numeric" // Afișează tastatura numerică pe mobil
                                        maxLength={10}
                                        placeholder="Ex: 0712345678"
                                    />
                                )}
                            </div>

                            {/* Secțiune Parolă */}
                            <div className="info-item">
                                <span className="label">Parolă</span>
                                <button className="view-btn" onClick={() => navigate("/app/change-password")}>
                                    Schimbă Parola
                                </button>
                                {/* Consideră și un link către /app/reset-password dacă este relevant aici */}
                            </div>
                        </div>
                    </div>

                    {/* Secțiune "Despre Mine" (About) */}
                    <div className="card">
                        <div className="info-item header-row">
                            <span className="label">Despre Mine <span className="highlight">(Opțional)</span></span>
                            {!editing.about && (
                                <button
                                    className="edit-btn"
                                    onClick={() => {
                                        setDraft(d => ({ ...d, about: profile.about || "" }));
                                        setEditing(e => ({ ...e, about: true, phone: false }));
                                    }}
                                >Modifică</button>
                            )}
                        </div>
                        {!editing.about ? (
                            <p className="about-text">{profile.about || "Nu ai adăugat încă o descriere."}</p>
                        ) : (
                            <EditTextarea
                                value={draft.about}
                                onChange={(v) => setDraft({ ...draft, about: v })}
                                onSave={() => handleUpdateProfileField({ about: draft.about })}
                                onCancel={() => {
                                    setDraft(d => ({ ...d, about: profile.about || "" }));
                                    setEditing(e => ({ ...e, about: false }));
                                }}
                                placeholder="Spune ceva despre tine..."
                            />
                        )}
                    </div>

                    {/* Secțiune 2FA */}
                    <div className="card">
                        <div className="info-item">
                            <span className="label">Autentificare cu Doi Factori (2FA)</span>
                            {profile.twoFactorEnabled ? (
                                <div className="value-edit">
                                    <span className="enabled-badge">2FA este Activat</span>
                                    <button className="danger-btn" onClick={handleDisable2FA} disabled={loading}>
                                        {loading ? "Se procesează..." : "Dezactivează 2FA"}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    className="edit-btn" // Poate un stil diferit, ex: "enable-btn"
                                    onClick={() => navigate("/app/setup-2fa")}
                                    disabled={loading}
                                >
                                    Activează 2FA
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Alte carduri informative - păstrate din primul exemplu */}
                    <div className="card">
                        <InfoRow label="Status KYC" value={<span className={`kyc-badge status-${profile.kycStatus?.toLowerCase()}`}>{profile.kycStatus || "Nespecificat"}</span>} />
                        {profile.kycStatus !== "Verified" && (
                            <InfoRow label="Detalii KYC" value={<button className="view-btn" onClick={() => alert("Funcționalitate KYC în lucru.")}>Verifică Status</button>} />
                        )}
                    </div>

                    <div className="card">
                        <InfoRow label="Detalii Bancare" value={<button className="view-btn" onClick={() => alert("Funcționalitate detalii bancare în lucru.")}>Vezi Detalii</button>} />
                    </div>
                </div>

                {/* --- Secțiunea Dreapta: Status, Expertiză, Realizări --- */}
                <div className="profile-right">
                    <div className="card status-header">
                        <InfoRow label={<span className="label large">Status Curent</span>}
                                 value={<span className="status-icon">⭐</span>} />
                    </div>

                    <div className="card">
                        <span className="label">Domenii de Expertiză</span>
                        <div className="tags spaced">
                            {profile.expertise && profile.expertise.length > 0 ? profile.expertise.map((tag, i) => (
                                <span key={i} className="tag active">{tag}</span>
                            )) : <span>Nespecificat</span>}
                        </div>
                    </div>

                    <HorizontalCard
                        outline="orange-outline"
                        label="An Curent de Studiu/Activitate"
                        value={profile.currentYear || "N/A"} // Presupunând că `currentYear` vine din profil
                        emoji="🛠️"
                    />

                    <HorizontalCard
                        outline="yellow-outline"
                        label="Rating Utilizator"
                        value={profile.rating ? `${profile.rating}/10` : "N/A"} // Presupunând că `rating` vine din profil
                        emoji="⭐"
                    />

                    <div className="card achievement-box">
                        <span className="label">Realizările Tale</span>
                        <ul className="achievement-list spaced">
                            {profile.achievements && profile.achievements.length > 0 ? profile.achievements.map((a, i) => (
                                <li key={i}>{a}</li>
                            )) : <li>Nicio realizare adăugată.</li>}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;