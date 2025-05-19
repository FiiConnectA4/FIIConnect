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
    const [errors, setErrors] = useState({});


    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "phone") {
            const onlyDigits = value.replace(/\D/g, "");
            if (onlyDigits.length > 10) return;

            setForm({ ...form, [name]: onlyDigits });
        } else {
            setForm({ ...form, [name]: value });
        }
    };


    const handleSubmit = () => {
        const { firstName, lastName, phone } = form;
        const newErrors = {};

        if (!firstName.trim()) newErrors.firstName = "Prenumele este obligatoriu.";
        if (!lastName.trim()) newErrors.lastName = "Numele este obligatoriu.";
        if (!phone.trim()) {
            newErrors.phone = "Numărul de telefon este obligatoriu.";
        } else if (!/^\d{10}$/.test(phone)) {
            newErrors.phone = "Numărul trebuie să aibă exact 10 cifre.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // curățăm erorile dacă totul e valid
        setErrors({});

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
        <>
            <style>{`
                .setup-profile-wrapper {
                    max-width: 420px;
                    margin: 4rem auto;
                    padding: 2rem 2.5rem;
                    background: #ffffff;
                    border-radius: 12px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, .1);
                    font-family: "Inter", sans-serif;
                }

                .setup-profile-wrapper h2 {
                    margin-bottom: 1.5rem;
                    font-size: 1.6rem;
                    text-align: center;
                    color: #333;
                }

                .setup-profile-wrapper input,
                .setup-profile-wrapper textarea {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 1px solid #d3dce6;
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: border-color .2s ease, box-shadow .2s ease;
                    background: #f9fafb;
                    margin-bottom: 1rem;
                }

                .setup-profile-wrapper input:focus,
                .setup-profile-wrapper textarea:focus {
                    outline: none;
                    border-color: #5a67d8;
                    box-shadow: 0 0 0 3px rgba(90, 103, 216, .2);
                    background: #fff;
                }

                .setup-profile-wrapper textarea {
                    resize: vertical;
                    min-height: 120px;
                }

                .setup-profile-wrapper button {
                    margin-top: 0.75rem;
                    padding: 0.75rem 1rem;
                    background: #5a67d8;
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background .2s ease, box-shadow .2s ease;
                    width: 100%;
                }

                .setup-profile-wrapper button:hover {
                    background: #434190;
                    box-shadow: 0 4px 12px rgba(90, 103, 216, .3);
                }

                .setup-profile-wrapper button:focus {
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(90, 103, 216, .4);
                }

                @media (max-width: 480px) {
                    .setup-profile-wrapper {
                        margin: 2rem 1rem;
                        padding: 1.5rem;
                    }
                    .setup-profile-wrapper h2 {
                        font-size: 1.4rem;
                    }
                }
                
                .error-msg {
    color: #e53e3e;
    font-size: 0.875rem;
    margin: -0.5rem 0 0.75rem 0;
    text-align: left;
}

.input-error {
    border-color: #e53e3e !important;
    background-color: #fff5f5;
}

            `}</style>
            <div className="setup-profile-wrapper">
                <h2>Configurează-ți profilul</h2>
                <input
                    name="firstName"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={handleChange}
                    className={errors.firstName ? "input-error" : ""}
                />
                {errors.firstName && <p className="error-msg">{errors.firstName}</p>}

                <input
                    name="lastName"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={handleChange}
                    className={errors.lastName ? "input-error" : ""}
                />
                {errors.lastName && <p className="error-msg">{errors.lastName}</p>}

                <input
                    name="phone"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={handleChange}
                    inputMode="numeric"
                    maxLength={11}
                    autoComplete="tel"
                    className={errors.phone ? "input-error" : ""}
                />
                {errors.phone && <p className="error-msg">{errors.phone}</p>}

                <textarea
                    name="about"
                    placeholder="Despre tine (opțional)"
                    value={form.about}
                    onChange={handleChange}
                />


                <button onClick={handleSubmit}>Salvează profil</button>
            </div>
        </>
    );
};

export default SetupProfile;