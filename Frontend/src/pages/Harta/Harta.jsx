import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Harta.css";
import demisolImg from "./Images/demisol.png";
import parterImg from "./Images/parter.png";
import etaj1Img from "./Images/etaj1.png";
import etaj2Img from "./Images/etaj2.png";
import etaj7Img from "./Images/etaj7.png"; // Import the new image
import hartaCompletaImg from "./Images/complet.png"; // Import the complete map image

const Harta = () => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [etaj, setEtaj] = useState("");
    const [showRezerva, setShowRezerva] = useState(false);
    const [etajRezerva, setEtajRezerva] = useState("");
    const [sala, setSala] = useState("");
    const saliPeEtaj = {
        Demisol: ["112"],
        Parter: ["210", "C2"],
        "Etajul 1": ["308", "309"],
        "Etajul 2": ["401", "403", "405", "409", "411", "412", "413"],
        "Etajul 7": ["901", "903", "905", "909"]
    };
    const etaje = [
        "Demisol",
        "Parter",
        "Etajul 1",
        "Etajul 2",
        "Etajul 7",
        "Harta completă" // Added "Harta completă" option
    ];
    return (
        <div className="harta-container">
            <h1 className="harta-title">Hartă</h1>
            <button
                className="harta-button"
                onClick={() => {
                    setShowDropdown(v => {
                        if (v) setEtaj(""); // reset when closing
                        return !v;
                    });
                    setShowRezerva(false);
                    setEtajRezerva("");
                    setSala("");
                }}
            >
                <img src="/Clock.png" alt="icon" className="harta-img-icon" />
                Vezi harta
            </button>
            <button
                className="harta-button"
                onClick={() => {
                    setShowRezerva(v => {
                        if (v) {
                            setEtajRezerva("");
                            setSala("");
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
                        onChange={e => {
                            setEtaj(e.target.value);
                            navigate("/app/harta/fullscreen", { state: { etaj: e.target.value } });
                        }}
                        className="harta-select"
                    >
                        <option value="" disabled hidden>Alege etajul</option>
                        {etaje.map((et, idx) => (
                            <option key={idx} value={et}>{et}</option>
                        ))}
                    </select>
                    {etaj && (
                        <img
                            src={
                                etaj === "Demisol" ? demisolImg :
                                    etaj === "Parter" ? parterImg :
                                        etaj === "Etajul 1" ? etaj1Img :
                                            etaj === "Etajul 2" ? etaj2Img :
                                                etaj === "Etajul 7" ? etaj7Img :
                                                    etaj === "Harta completă" ? hartaCompletaImg :
                                                ""
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
                        onChange={e => {
                            setEtajRezerva(e.target.value);
                            setSala("");
                        }}
                        className="harta-select"
                    >
                        <option value="" disabled hidden>Alege etajul</option>
                        {Object.keys(saliPeEtaj).map((et, idx) => (
                            <option key={idx} value={et}>{et}</option>
                        ))}
                    </select>
                    {etajRezerva && (
                        <>
                            <label className="harta-label">Alege sala</label>
                            <select
                                value={sala}
                                onChange={e => setSala(e.target.value)}
                                className="harta-select"
                            >
                                <option value="" disabled hidden>Alege sala</option>
                                {saliPeEtaj[etajRezerva].map((s, idx) => (
                                    <option key={idx} value={s}>{s}</option>
                                ))}
                            </select>
                        </>
                    )}
                    {sala && (
                        <div className="harta-intervale">
                            Intervalele libere pentru sala selectată ({sala}):
                            <div className="harta-intervale-mock">
                                (Aici se pot afișa intervalele libere din backend sau mock)
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Harta;