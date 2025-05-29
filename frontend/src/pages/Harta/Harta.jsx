import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Harta.css";
import demisolImg from "./Images/demisol.png";
import parterImg from "./Images/parter.png";
import etaj1Img from "./Images/etaj1.png";
import etaj2Img from "./Images/etaj2.png";
import etaj7Img from "./Images/etaj7.png";
import hartaCompletaImg from "./Images/complet.png";

const Harta = () => {
    const navigate = useNavigate();

    // State vizibilitate secțiuni
    const [showDropdown, setShowDropdown] = useState(false);
    const [showRezerva, setShowRezerva] = useState(false);

    // Vizualizare harta fullscreen
    const [etaj, setEtaj] = useState("");

    // Rezervare sala
    const [etajRezerva, setEtajRezerva] = useState("");
    const [sala, setSala] = useState("");
    const [zi, setZi] = useState("");

    // Intervale libere
    const [intervaleLibere, setIntervaleLibere] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const saliPeEtaj = {
        Demisol: ["112"],
        Parter: ["210", "C2"],
        "Etajul 1": ["308", "309"],
        "Etajul 2": ["401", "403", "405", "409", "411", "412", "413"],
        "Etajul 7": ["901", "903", "905", "909"],
    };

    const etaje = [
        "Demisol",
        "Parter",
        "Etajul 1",
        "Etajul 2",
        "Etajul 7",
        "Harta completă",
    ];

    // Fetch intervale libere când schimbă sala și ziua
    useEffect(() => {
        if (sala && zi) {
            setLoading(true);
            setError("");
            setIntervaleLibere([]);
            const token = localStorage.getItem("token");
            fetch(`http://localhost:8080/sala-libera?sala=${encodeURIComponent(sala)}&zi=${encodeURIComponent(zi)}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

                .then((res) => {
                    if (!res.ok) throw new Error("Eroare la încărcarea intervalelor.");
                    return res.json();
                })
                .then((data) => {
                    setIntervaleLibere(data);
                    setLoading(false);
                })
                .catch((err) => {
                    setError(err.message);
                    setLoading(false);
                });
        } else {
            setIntervaleLibere([]);
        }
    }, [sala, zi]);

    return (
        <div className="harta-container">
            <h1 className="harta-title">Hartă</h1>

            <button
                className="harta-button"
                onClick={() => {
                    setShowDropdown((v) => {
                        if (v) setEtaj("");
                        return !v;
                    });
                    setShowRezerva(false);
                    setEtajRezerva("");
                    setSala("");
                    setZi("");
                    setIntervaleLibere([]);
                    setError("");
                }}
            >
                <img src="/Clock.png" alt="icon" className="harta-img-icon" />
                Vezi harta
            </button>

            <button
                className="harta-button"
                onClick={() => {
                    setShowRezerva((v) => {
                        if (v) {
                            setEtajRezerva("");
                            setSala("");
                            setZi("");
                            setIntervaleLibere([]);
                            setError("");
                        }
                        return !v;
                    });
                    setShowDropdown(false);
                    setEtaj("");
                }}
            >
                <img src="/Modificare.png" alt="icon" className="harta-img-icon" />
                Rezervă Sala
            </button>

            {showDropdown && (
                <div className="harta-dropdown">
                    <label className="harta-label">Alege etajul</label>
                    <select
                        value={etaj}
                        onChange={(e) => {
                            setEtaj(e.target.value);
                            navigate("/app/harta/fullscreen", { state: { etaj: e.target.value } });
                        }}
                        className="harta-select"
                    >
                        <option value="" disabled hidden>
                            Alege etajul
                        </option>
                        {etaje.map((et, idx) => (
                            <option key={idx} value={et}>
                                {et}
                            </option>
                        ))}
                    </select>

                    {etaj && (
                        <img
                            src={
                                etaj === "Demisol"
                                    ? demisolImg
                                    : etaj === "Parter"
                                        ? parterImg
                                        : etaj === "Etajul 1"
                                            ? etaj1Img
                                            : etaj === "Etajul 2"
                                                ? etaj2Img
                                                : etaj === "Etajul 7"
                                                    ? etaj7Img
                                                    : etaj === "Harta completă"
                                                        ? hartaCompletaImg
                                                        : ""
                            }
                            alt={etaj}
                            className="harta-img"
                        />
                    )}
                </div>
            )}

            {showRezerva && (
                <div className="harta-rezerva">
                    <label className="harta-label">Alege etajul</label>
                    <select
                        value={etajRezerva}
                        onChange={(e) => {
                            setEtajRezerva(e.target.value);
                            setSala("");
                            setZi("");
                            setIntervaleLibere([]);
                            setError("");
                        }}
                        className="harta-select"
                    >
                        <option value="" disabled hidden>
                            Alege etajul
                        </option>
                        {Object.keys(saliPeEtaj).map((et, idx) => (
                            <option key={idx} value={et}>
                                {et}
                            </option>
                        ))}
                    </select>

                    {etajRezerva && (
                        <>
                            <label className="harta-label">Alege sala</label>
                            <select
                                value={sala}
                                onChange={(e) => {
                                    setSala(e.target.value);
                                    setZi("");
                                    setIntervaleLibere([]);
                                    setError("");
                                }}
                                className="harta-select"
                            >
                                <option value="" disabled hidden>
                                    Alege sala
                                </option>
                                {saliPeEtaj[etajRezerva].map((s, idx) => (
                                    <option key={idx} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}

                    {sala && (
                        <>
                            <label className="harta-label">Alege ziua</label>
                            <select
                                value={zi}
                                onChange={(e) => setZi(e.target.value)}
                                className="harta-select"
                            >
                                <option value="" disabled hidden>
                                    Alege ziua
                                </option>
                                <option value="Luni">Luni</option>
                                <option value="Marti">Marți</option>
                                <option value="Miercuri">Miercuri</option>
                                <option value="Joi">Joi</option>
                                <option value="Vineri">Vineri</option>
                                <option value="Sambata">Sâmbătă</option>
                            </select>
                        </>
                    )}

                    {loading && <p>Se încarcă intervalele libere...</p>}

                    {error && <p style={{ color: "red" }}>{error}</p>}

                    {intervaleLibere.length > 0 && (
                        <div className="harta-intervale">
                            <h4>
                                Intervalele libere pentru sala {sala} în ziua {zi}:
                            </h4>
                            <ul>
                                {intervaleLibere.map((interval, idx) => (
                                    <li key={idx}>{interval}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {!loading && !error && sala && zi && intervaleLibere.length === 0 && (
                        <p>Nu există intervale libere pentru sala selectată în ziua aleasă.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Harta;