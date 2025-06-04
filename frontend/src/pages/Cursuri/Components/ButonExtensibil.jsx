// ButonExtensibil.js
import './Component.css';
import { useState } from 'react';

const ButonExtensibil = ({ text, professors = [], onSelect, selectedId = null }) => {
    const [expanded, setExpanded] = useState(false);

    const handleClick = () => {
        setExpanded(!expanded);
    };

    const handleProfesorClick = (profesor) => {
        // Apelez callback-ul din părinte cu profesorul ales
        onSelect && onSelect(profesor);
        // Păstrez sub-meniul deschis (dacă vrei să rămână deschis) 
        // sau îl închizi automat:
        setExpanded(false);
    };

    return (
        <div className="buton-container">
            <button
                className="buton-curs"
                onClick={handleClick}
            >
                {text}
            </button>
            {expanded && (
                <div className="buton-submenu">
                    {Array.isArray(professors) && professors.length > 0 ? (
                        professors.map((profesor) => (
                            <p
                                key={profesor.id}
                                className={`buton-submenu-item ${selectedId === profesor.id ? 'selected' : ''}`}
                                onClick={() => handleProfesorClick(profesor)}
                            >
                                {profesor.name}
                            </p>
                        ))
                    ) : (
                        <p>Nu există profesori disponibili.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ButonExtensibil;
