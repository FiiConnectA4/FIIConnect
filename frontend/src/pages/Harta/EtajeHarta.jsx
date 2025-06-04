import React, { useState } from "react";
import "./EtajeHarta.css";

const EtajeHarta = () => {
    const [etaj, setEtaj] = useState("");
    const etaje = [
        "Demisol",
        "Parter",
        "Etajul 1",
        "Etajul 2",
        "Etajul 7"
    ];

    return (
        <div className="etaje-container">
            <label className="etaje-label">Alege etajul</label>
            <select
                value={etaj}
                onChange={e => setEtaj(e.target.value)}
                className="etaje-select"
            >
                <option value="" disabled hidden>Alege etajul</option>
                {etaje.map((et, idx) => (
                    <option key={idx} value={et}>{et}</option>
                ))}
            </select>
            {etaj && (
                <div className="etaje-selected">
                    Ai selectat: {etaj} 
                </div>
            )}
        </div>
    );
};

export default EtajeHarta;