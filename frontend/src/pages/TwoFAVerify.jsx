import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

const TwoFAVerify = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const username = state?.username;          // primit din Login
    const [code, setCode] = useState("");

    if (!username) {
        // dacă intră aici direct, îl trimitem înapoi la login
        navigate("/app/login");
    }

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                "http://localhost:34101/users/login/verify",
                { username, twoFactorCode: code }
            );

            if (data.token) {
                localStorage.setItem("token", data.token);
                navigate("/app/dashboard");
            } else {
                throw new Error("Răspuns neașteptat de la server.");
            }
        } catch (err) {
            console.error("Eroare la verificarea 2FA:", err);
            alert("Cod 2FA invalid sau expirat.");
        }
    };

    return (
        <div className="login-wrapper">
            <form className="login-card" onSubmit={handleVerify}>
                <h1>Verificare 2FA</h1>

                <input
                    type="text"
                    placeholder="Cod 6 cifre"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength={6}
                    required
                />

                <button type="submit">Verifică</button>
            </form>
        </div>
    );
};

export default TwoFAVerify;
