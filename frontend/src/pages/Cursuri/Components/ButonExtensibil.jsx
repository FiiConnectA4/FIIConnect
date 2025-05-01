import './Component.css';
import { useState } from 'react';

const ButonExtensibil = ({ text, professors }) => {
    const [expanded, setExpanded] = useState(false);

    const handleClick = () => {
        setExpanded(!expanded);
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
                        professors.map((profesor, index) => (
                            <p key={index} className="buton-submenu-item">
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