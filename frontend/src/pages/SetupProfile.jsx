import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SetupProfile = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        about: ''
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        const token = localStorage.getItem("token");
        fetch("/profile/setup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(form)
        })
            .then((res) => {
                if (!res.ok) throw new Error("Eroare la creare profil");
                return res.text();
            })
            .then(() => navigate("/app/profile"))
            .catch((err) => alert("Eroare: " + err.message));
    };

    return (
        <div className="setup-profile-wrapper">
            <h2>Configurează-ți profilul</h2>
            <input name="firstName" placeholder="First Name" onChange={handleChange} />
            <input name="lastName" placeholder="Last Name" onChange={handleChange} />
            <input name="phone" placeholder="Phone" onChange={handleChange} />
            <textarea name="about" placeholder="Despre tine" onChange={handleChange} />
            <button onClick={handleSubmit}>Salvează profil</button>
        </div>
    );
};

export default SetupProfile;
