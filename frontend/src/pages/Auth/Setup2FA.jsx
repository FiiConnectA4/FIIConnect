import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import "../../styles/Setup2FA.css";

export default function Setup2FA() {
    /* -------------------- state -------------------- */
    const [qrUrl,  setQrUrl]  = useState("");
    const [secret, setSecret] = useState("");
    const [code,   setCode]   = useState("");
    const [step,   setStep]   = useState(1);       // 1 = scan, 2 = confirm
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState("");
    const navigate = useNavigate();

    /* -------------------- PAS 1 – start -------------------- */
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { setError("Nu ești autentificat."); setLoading(false); return; }

        axios.post(
            "http://localhost:34101/users/2fa/start",
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then(res => {
                setQrUrl(res.data.qrUrl);
                setSecret(res.data.secret);
            })
            .catch(err => {
                const msg = err.response?.data?.message || err.response?.data || "Eroare la inițierea 2FA.";
                setError(msg);
            })
            .finally(() => setLoading(false));
    }, []);

    /* -------------------- PAS 2 – confirm -------------------- */
    const confirmCode = () => {
        if (code.length !== 6) { setError("Codul trebuie să aibă 6 cifre."); return; }
        setLoading(true);
        const token = localStorage.getItem("token");

        axios.post(
            "http://localhost:34101/users/2fa/confirm",
            { code },
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then(() => {
                alert("Two-Factor Authentication a fost ACTIVAT!");
                navigate("/app/profile");
            })
            .catch(err => {
                const msg = err.response?.data?.message || "Cod 2FA invalid. Încearcă din nou.";
                setError(msg);
            })
            .finally(() => setLoading(false));
    };

    /* -------------------- Cancel -------------------- */
    const cancelSetup = () => {
        const token = localStorage.getItem("token");
        axios.post(
            "http://localhost:34101/users/2fa/cancel",
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        ).finally(() => navigate("/app/profile"));
    };

    /* -------------------- UI -------------------- */
    if (loading) return <div className="text-center py-10">Se încarcă…</div>;
    if (error)   return (
        <div className="max-w-lg mx-auto p-6 text-center text-red-600">
            {error}<br />
            <button onClick={() => navigate("/app/profile")} className="underline mt-4">
                Înapoi la profil
            </button>
        </div>
    );

    return (
        <div className="setup2fa-wrapper">
            <div className="setup2fa-card">
                {/* titlu */}
                <h1>{step === 1 ? "Scanează codul 2FA" : "Confirmă codul 2FA"}</h1>

                {/* QR */}
                {step === 1 && (
                    <>
                        <div className="qr-box">
                            {qrUrl.startsWith("otpauth://")
                                ? <QRCodeSVG value={qrUrl} size={200} />
                                : <img src={qrUrl} alt="QR" width={200} height={200} />
                            }
                        </div>

                        <div className="secret-box">{secret}</div>

                        <button className="main-btn" onClick={() => setStep(2)}>
                            Am scanat – continuă
                        </button>
                        <button className="secondary-btn" onClick={cancelSetup}>
                            Anulează
                        </button>
                    </>
                )}

                {/* COD */}
                {step === 2 && (
                    <>
                        <input
                            className="setup2fa-input"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            maxLength={6}
                            placeholder="000 000"
                        />

                        <button className="main-btn" onClick={confirmCode}>
                            Confirmă
                        </button>
                        <button className="secondary-btn" onClick={cancelSetup}>
                            Anulează
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
