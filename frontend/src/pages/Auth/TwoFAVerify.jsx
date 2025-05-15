import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Login.css";
import logo from "../../styles/FiiConnect-removebg-preview.png"

const TwoFAVerify = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const username = state?.username || "";
    const [code, setCode] = useState("");

    useEffect(() => {
        if (!username) navigate("/app/login", { replace: true });
    }, [username, navigate]);

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

    return (
        <div className="login-container">
            <div className="login-box">
                <img
                    src={logo}
                    alt="FIIConnect"
                    className="logo"
                />
                <h2 className="subtitle">INTRODU CODUL 2FA</h2>

                <form className="login-form" onSubmit={handleVerify}>
                    <input
                        className="input"
                        type="text"
                        placeholder="Cod 6 cifre"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        maxLength={6}
                        required
                    />

                    <button className="login-button" type="submit">
                        Verifică
                    </button>
                </form>

                <p className="copyright">© FIIConnect</p>
            </div>
        </div>
    );
};

export default TwoFAVerify;
