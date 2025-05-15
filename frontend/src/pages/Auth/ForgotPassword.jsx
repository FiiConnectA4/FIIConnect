import React, { useState } from "react";
import "../../styles/ForgotPassword.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const res = await fetch("/users/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ email }),
            });

            const data = await res.text();

            if (res.ok) setMessage(data);
            else setError(data);
        } catch (err) {
            setError("Eroare de rețea.");
        }
    };

    return (
        <div className="forgot-wrapper">
            <form className="forgot-form" onSubmit={handleSubmit}>
                <h2>Resetare parolă</h2>
                <input
                    type="email"
                    placeholder="Emailul tău"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Trimite link-ul</button>

                {message && <p className="success">{message}</p>}
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default ForgotPassword;
