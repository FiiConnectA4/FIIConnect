import React from 'react';
import './DetaliiCurs.css';

const DetaliiCurs = ({ onBack }) => {
    return (
        <div className="detalii-container">
            <button className="buton-inapoi" onClick={onBack}>&lt; Înapoi</button>

            <div className="titlu-curs">
                <h1>Tehnologii Web <span className="emoji">🕒</span></h1>
                <span className="profesor">Profesor: Popa Tudor</span>
            </div>

            <div className="sectiune">
                <h2>DESCRIERE CURS:</h2>
            </div>

            <div className="sectiune">
                <h2>Metoda notare:(componente)</h2>
            </div>

            <div className="sectiune">
                <h2>Resurse bibliografice:</h2>
            </div>
        </div>
    );
};

export default DetaliiCurs;
