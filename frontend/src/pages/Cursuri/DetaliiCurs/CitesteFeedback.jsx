import React, { useState, useEffect } from 'react';
import './CitesteFeedback.css';

const CitesteFeedback = ({ onBack }) => {
    // Exemplu „hard-code” de feedback-uri
    const hardcodedFeedbacks = [
        { id: { idCurs: 1, idStud: 101 }, message: 'Mi s-a părut cursul foarte util și bine structurat.' },
        { id: { idCurs: 1, idStud: 102 }, message: 'Profesorul explică clar, dar aș dori mai multe exemple practice.' },
        { id: { idCurs: 1, idStud: 103 }, message: 'Materialele suplimentare ar putea fi organizate mai bine.' },
        { id: { idCurs: 1, idStud: 101 }, message: 'Mi s-a părut cursul foarte util și bine structurat.' },
        { id: { idCurs: 1, idStud: 102 }, message: 'Profesorul explică clar, dar aș dori mai multe exemple practice.' },
        { id: { idCurs: 1, idStud: 103 }, message: 'Materialele suplimentare ar putea fi organizate mai bine.' },
        { id: { idCurs: 1, idStud: 101 }, message: 'Mi s-a părut cursul foarte util și bine structurat.' },
        { id: { idCurs: 1, idStud: 102 }, message: 'Profesorul explică clar, dar aș dori mai multe exemple practice.' },
        { id: { idCurs: 1, idStud: 103 }, message: 'Materialele suplimentare ar putea fi organizate mai bine.' },
        { id: { idCurs: 1, idStud: 101 }, message: 'Mi s-a părut cursul foarte util și bine structurat.' },
        { id: { idCurs: 1, idStud: 102 }, message: 'Profesorul explică clar, dar aș dori mai multe exemple practice.' },
        { id: { idCurs: 1, idStud: 103 }, message: 'Materialele suplimentare ar putea fi organizate mai bine.' },
        { id: { idCurs: 1, idStud: 101 }, message: 'Mi s-a părut cursul foarte util și bine structurat.' },
        { id: { idCurs: 1, idStud: 102 }, message: 'Profesorul explică clar, dar aș dori mai multe exemple practice.' },
        { id: { idCurs: 1, idStud: 103 }, message: 'Materialele suplimentare ar putea fi organizate mai bine.' },
    ];

    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // În loc de fetch, încărcăm direct feedback-urile hard-code
        setFeedbacks(hardcodedFeedbacks);
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="feedback-container">
                <button className="buton-inapoi" onClick={onBack}>
                    ← Înapoi
                </button>
                <div className="loading">Se încarcă feedback-urile...</div>
            </div>
        );
    }

    return (
        <div className="feedback-container">
            <button className="buton-inapoi" onClick={onBack}>
                ← Înapoi
            </button>

            <div className="feedback-header">
                <h1>Feedback-uri</h1>
            </div>

            {feedbacks.length === 0 ? (
                <div className="no-feedback">Nu există feedback-uri disponibile.</div>
            ) : (
                <div className="feedback-list">
                    {feedbacks.map(f => (
                        <div key={`${f.id.idCurs}-${f.id.idStud}`} className="feedback-card">
                            <div className="feedback-info">
                                <span className="feedback-label">Curs ID:</span> {f.id.idCurs}
                            </div>
                            <div className="feedback-info">
                                <span className="feedback-label">Student ID:</span> {f.id.idStud}
                            </div>
                            <div className="feedback-message">{f.message}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CitesteFeedback;
