import './Component.css';
import { useState, useEffect } from 'react';

const ButonExtensibil = ({ text, onNavigate, className, courseId }) => {
    const [expanded, setExpanded] = useState(false);
    const [professors, setProfessors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleClick = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        if (expanded && professors.length === 0 && courseId) {
            console.log(`Fetching data for courseId: ${courseId}`);
            setLoading(true);
            fetch(`http://localhost:34101/didactic/course/${courseId}`)
                .then((response) => {
                    console.log('Response status:', response.status);
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log('API Response for courseId', courseId, ':', data);
                    const profList = data.professors?.map((p) => ({
                        name: `${p.professor.firstName} ${p.professor.lastName}`,
                        role: p.role,
                        rank: p.professor.rank,
                    })) || [];
                    console.log('Processed profList:', profList);
                    setProfessors(profList);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error('Eroare la încărcarea profesorilor:', err);
                    setError(`Eroare: ${err.message}`);
                    setLoading(false);
                });
        }
    }, [expanded, courseId]); // Removed professors.length to avoid infinite loop

    return (
        <div className="buton-container">
            <button
                className={`buton-curs ${className || ''}`}
                onClick={handleClick}
            >
                {text}
            </button>
            {expanded && (
                <div className="buton-submenu">
                    {loading ? (
                        <p>Se încarcă...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : professors.length > 0 ? (
                        professors.map((profesor, index) => (
                            <button key={index} className="buton-submenu-item">
                                {profesor.name} ({profesor.role}, {profesor.rank})
                            </button>
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
