import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        "Etajul 7"
    ];
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
            <h1>Hartă</h1>
            <button
                className="orar-button"
                style={{ width: '340px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '0.7rem', paddingLeft: '1.2rem' }}
                onClick={() => setShowDropdown(v => !v)}
            >
                <img src="/Clock.png" alt="icon" style={{ width: '28px', height: '28px', marginRight: '0.5rem' }} />
                Vezi harta
            </button>
            <button
                className="orar-button"
                style={{ width: '340px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '0.7rem', paddingLeft: '1.2rem' }}
                onClick={() => setShowRezerva(v => !v)}
            >
                <img src="/Modificare.png" alt="icon" style={{ width: '28px', height: '28px', marginRight: '0.5rem' }} />
                Rezervă Sala
            </button>
            {showDropdown && (
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <label style={{ color: '#003087', fontWeight: 'bold', fontSize: '1.1rem' }}>Alege etajul</label>
                    <select
                        value={etaj}
                        onChange={e => setEtaj(e.target.value)}
                        style={{
                            width: '200px',
                            backgroundColor: '#003087',
                            color: 'white',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            borderRadius: '0.5rem',
                            border: 'none',
                            height: '44px',
                            fontSize: '1rem',
                            paddingLeft: '1rem',
                            marginBottom: '0.5rem',
                        }}
                    >
                        <option value="" disabled hidden>Alege etajul</option>
                        {etaje.map((et, idx) => (
                            <option key={idx} value={et}>{et}</option>
                        ))}
                    </select>
                    {etaj && <div style={{ color: '#003087', fontWeight: 'bold' }}>Ai selectat: {etaj}</div>}
                    {etaj && (
                        <img
                            src={
                                etaj === 'Demisol' ? '/Book.png' :
                                etaj === 'Parter' ? '/Book open.png' :
                                etaj === 'Etajul 1' ? '/Archive.png' :
                                etaj === 'Etajul 2' ? '/Clock.png' :
                                etaj === 'Etajul 7' ? '/Modificare.png' :
                                ''
                            }
                            alt={etaj}
                            style={{ width: '300px', height: 'auto', borderRadius: '1rem', boxShadow: '0 2px 12px #00308733' }}
                        />
                    )}
                </div>
            )}
            {showRezerva && (
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <label style={{ color: '#003087', fontWeight: 'bold', fontSize: '1.1rem' }}>Alege etajul</label>
                    <select
                        value={etajRezerva}
                        onChange={e => {
                            setEtajRezerva(e.target.value);
                            setSala("");
                        }}
                        style={{
                            width: '200px',
                            backgroundColor: '#003087',
                            color: 'white',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            borderRadius: '0.5rem',
                            border: 'none',
                            height: '44px',
                            fontSize: '1rem',
                            paddingLeft: '1rem',
                            marginBottom: '0.5rem',
                        }}
                    >
                        <option value="" disabled hidden>Alege etajul</option>
                        {Object.keys(saliPeEtaj).map((et, idx) => (
                            <option key={idx} value={et}>{et}</option>
                        ))}
                    </select>
                    {etajRezerva && (
                        <>
                            <label style={{ color: '#003087', fontWeight: 'bold', fontSize: '1.1rem' }}>Alege sala</label>
                            <select
                                value={sala}
                                onChange={e => setSala(e.target.value)}
                                style={{
                                    width: '200px',
                                    backgroundColor: '#003087',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    borderRadius: '0.5rem',
                                    border: 'none',
                                    height: '44px',
                                    fontSize: '1rem',
                                    paddingLeft: '1rem',
                                    marginBottom: '0.5rem',
                                }}
                            >
                                <option value="" disabled hidden>Alege sala</option>
                                {saliPeEtaj[etajRezerva].map((s, idx) => (
                                    <option key={idx} value={s}>{s}</option>
                                ))}
                            </select>
                        </>
                    )}
                    {sala && (
                        <div style={{ color: '#003087', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '1rem' }}>
                            Intervalele libere pentru sala selectată ({sala}):
                            <div style={{ color: '#222', fontWeight: 'normal', fontSize: '1rem', marginTop: '0.5rem' }}>
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