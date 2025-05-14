import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

const TwoFAVerify = () => {
    const { state } = useLocation();
    const navigate  = useNavigate();
    const username  = state?.username || "";      // poate veni undefined pe refresh
    const [code, setCode] = useState("");

    /* dacă nu avem username (ex: pagină reload) => back to login */
    useEffect(() => {
        if (!username) navigate("/app/login", { replace: true });
    }, [username, navigate]);

    /* ---------------- handle verify ---------------- */
    const handleVerify = async (e) => {
        e.preventDefault();

        const cleanCode = code.trim();
        if (!/^\d{6}$/.test(cleanCode)) {
            alert("Codul trebuie să conțină exact 6 cifre.");
            return;
        }

        try {
            const { data } = await axios.post(
                "http://localhost:34101/users/login/verify",
                { username, twoFactorCode: cleanCode },
                { headers: { "Content-Type": "application/json" } }
            );

            if (data.token) {
                localStorage.setItem("token", data.token);
                navigate("/app/dashboard");
            } else {
                throw new Error("Serverul nu a trimis token-ul JWT.");
            }
        } catch (err) {
            console.error("Eroare la verificarea 2FA:", err);
            alert("Cod 2FA invalid sau expirat.");
        }
    };

    /* ---------------- UI ---------------- */
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
                    className="code-input"
                    required
                />

                <button type="submit">Verifică</button>
            </form>
        </div>
    );
};

export default TwoFAVerify;
