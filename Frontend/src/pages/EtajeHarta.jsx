import React, { useState } from "react";

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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', marginTop: '2rem' }}>
      <label style={{ color: '#003087', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1rem' }}>Alege etajul</label>
      <select
        value={etaj}
        onChange={e => setEtaj(e.target.value)}
        style={{
          width: '220px',
          backgroundColor: '#003087',
          color: 'white',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          borderRadius: '0.5rem',
          border: 'none',
          height: '48px',
          marginBottom: '1rem',
          transition: 'background-color 0.2s ease',
          paddingLeft: '1rem',
          fontSize: '1rem',
          appearance: 'none',
        }}
      >
        <option value="" disabled hidden>Alege etajul</option>
        {etaje.map((et, idx) => (
          <option key={idx} value={et}>{et}</option>
        ))}
      </select>
      {etaj && (
        <div style={{ color: '#003087', fontWeight: 'bold', fontSize: '1.1rem' }}>
          Ai selectat: {etaj}
        </div>
      )}
    </div>
  );
};

export default EtajeHarta;
