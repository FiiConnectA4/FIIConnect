import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = "http://localhost:34101"; // folosește același URL

const SetupProfile = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        about: ''
    });
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        setError(null);
        setLoading(true);

        const token = localStorage.getItem("token");
        if (!token) {
            setError("Nu ești autentificat!");
            setLoading(false);
            return;
        }

        try {
            console.log("Creating profile with data:", form);

            // 1. Creare profil (fără poza)
            const res = await fetch(`${BACKEND_URL}/profile/setup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                },
                body: JSON.stringify(form)
            });

            console.log("Profile creation response:", res.status);

            if (!res.ok) {
                const errorText = await res.text();
                console.error("Profile creation error:", errorText);
                throw new Error(`Eroare la creare profil: ${res.status} ${errorText}`);
            }

            // 2. Dacă s-a selectat o poză, upload
            if (file instanceof File) {
                console.log("Uploading file:", file.name, "size:", file.size);

                const formData = new FormData();
                formData.append("file", file);

                const uploadRes = await fetch(`${BACKEND_URL}/profile/photo`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        // Nu pune Content-Type aici, FormData o setează automat
                    },
                    mode: 'cors',
                    body: formData
                });

                console.log("Photo upload response:", uploadRes.status);

                if (!uploadRes.ok) {
                    const errorText = await uploadRes.text();
                    console.error("Photo upload error:", errorText);
                    throw new Error(`Eroare la upload poză: ${uploadRes.status} ${errorText}`);
                }

                setFile(null);
            }

            navigate("/app/profile");
        } catch (err) {
            console.error("Setup profile error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="setup-profile-wrapper">
            <h2>Configurează-ți profilul</h2>

            {error && <div className="error-message">{error}</div>}

            <input
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                required
            />
            <input
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
            />
            <input
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
            />
            <textarea
                name="about"
                placeholder="Despre tine"
                value={form.about}
                onChange={handleChange}
            />

            <div className="file-upload">
                <input
                    type="file"
                    id="photo"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <label htmlFor="photo">
                    {file ? file.name : "Alege o poză de profil (opțional)"}
                </label>
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading || !form.firstName || !form.lastName}
            >
                {loading ? "Se procesează..." : "Salvează profil"}
            </button>
        </div>
    );
};

export default SetupProfile;
