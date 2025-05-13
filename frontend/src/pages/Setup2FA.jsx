import { useState, useEffect } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";

export default function Setup2FA() {
    const [qrUrl, setQrUrl]     = useState("");
    const [secret, setSecret]   = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Nu ești autentificat (lipsește token-ul JWT).");
            setLoading(false);
            return;
        }

        axios.post(
            "http://localhost:34101/users/setup-2fa",      // ← portul Spring
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then((res) => {
                setQrUrl(res.data.qrUrl);     // ex.: "otpauth://totp/..."
                setSecret(res.data.secret);   // ex.: "S6AB…"
            })
            .catch((err) => {
                const msg =
                    err.response?.data?.message ||
                    err.response?.data ||
                    "Eroare la configurarea 2FA.";
                setError(msg);
            })
            .finally(() => setLoading(false));
    }, []);

    /* ---------- UI ---------- */
    if (loading) return <div className="text-center py-10">Se încarcă…</div>;
    if (error)   return <div className="text-center text-red-500 py-10">{error}</div>;

    return (
        <div className="max-w-lg mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold text-center">Configurează autentificarea 2FA</h1>

            {/* Cod QR */}
            {qrUrl.startsWith("otpauth://") ? (
                <QRCodeSVG value={qrUrl} size={200} className="mx-auto" />
            ) : (
                // Dacă backend-ul a trimis un Data-URI PNG
                <img src={qrUrl} alt="QR 2FA" className="mx-auto w-52 h-52" />
            )}

            {/* Secret pentru fallback manual */}
            <div className="bg-gray-100 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-2">Secret (introdu-l manual dacă nu poți scana):</p>
                <code className="font-mono break-all text-indigo-600">{secret}</code>
            </div>

            <div className="text-sm text-gray-500 leading-relaxed">
                1. Deschide <strong>Google Authenticator</strong> sau altă aplicație TOTP.<br />
                2. Scanează codul QR sau introduce manual secretul de mai sus.<br />
                3. La următoarea autentificare ți se va cere codul generat de aplicație.
            </div>

            <button
                onClick={() => (window.location.href = "/dashboard")}  // sau navigate("/dashboard")
                className="w-full py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
                Am configurat – mergi la Dashboard
            </button>
        </div>
    );
}
