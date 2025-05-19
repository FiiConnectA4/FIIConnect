import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../../styles/ResetPassword.css";

const ResetPassword = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const token = params.get("token");

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!password || password !== confirm) {
            setError("Parolele nu coincid.");
            return;
        }

        try {
            const res = await fetch(`/users/reset-password?token=${token}&newPassword=${encodeURIComponent(password)}`, {
                method: "POST",
            });
            const data = await res.text();

            if (res.ok) {
                setSuccess(data);
                setTimeout(() => navigate("/"), 2000);
            } else {
                setError(data);
            }
        } catch {
            setError("Eroare de rețea.");
        }
    };

    if (!token) return <p className="error">Token invalid sau lipsă.</p>;

    return (
        <div className="reset-wrapper">
            <form className="reset-form" onSubmit={handleSubmit}>
                <h2>Setează o parolă nouă</h2>
                <input
                    type="password"
                    placeholder="Parola nouă"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirmă parola"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                />
                <button type="submit">Resetează</button>

                {success && <p className="success">{success}</p>}
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default ResetPassword;
