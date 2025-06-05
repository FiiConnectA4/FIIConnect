import React, { useState, useEffect } from 'react';
import './CitesteFeedback.css';

const CitesteFeedback = ({ onBack }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get current professor's ID from /person/me endpoint
                const personResponse = await fetch('http://localhost:34101/person/me',{headers:{Authorization: `Bearer ${localStorage.getItem('token')}`}});
                if (!personResponse.ok) {
                    throw new Error('Nu s-au putut încărca informațiile profesorului');
                }

                const personData = await personResponse.json();
                const currentProfId = personData.professor?.id;

                if (!currentProfId) {
                    throw new Error('ID-ul profesorului nu a fost găsit');
                }

                const response = await fetch(`/didactic/feedback?profId=${currentProfId}`,{headers:{Authorization: `Bearer ${localStorage.getItem('token')}`}});

                if (!response.ok) {
                    if (response.status === 404) {
                        setFeedbacks([]);
                    } else {
                        throw new Error(`Error: ${response.status}`);
                    }
                } else {
                    const data = await response.json();
                    setFeedbacks(data);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, []);

    const renderStars = (grade) => {
        const stars = [];
        for (let i = 1; i <= 10; i++) {
            stars.push(
                <span
                    key={i}
                    className={`star ${i <= grade ? 'filled' : 'empty'}`}
                >
                    ★
                </span>
            );
        }
        return stars;
    };

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

    if (error) {
        return (
            <div className="feedback-container">
                <button className="buton-inapoi" onClick={onBack}>
                    ← Înapoi
                </button>
                <div className="error-message">
                    Eroare la încărcarea feedback-urilor: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="feedback-container">
            <button className="buton-inapoi" onClick={onBack}>
                ← Înapoi
            </button>

            <div className="feedback-header">
                <h1>Feedback-uri Primite</h1>
                <p className="feedback-count">
                    {feedbacks.length} feedback{feedbacks.length !== 1 ? '-uri' : ''}
                </p>
            </div>

            {feedbacks.length === 0 ? (
                <div className="no-feedback">Nu există feedback-uri disponibile.</div>
            ) : (
                <div className="feedback-list">
                    {feedbacks.map((f, index) => (
                        <div key={`feedback-${index}`} className="feedback-card">
                            <div className="feedback-text">
                                <h3>Comentariu:</h3>
                                <p>{f.feedbackText}</p>
                            </div>

                            <div className="grades-section">
                                <div className="grade-item">
                                    <span className="grade-label">Predare:</span>
                                    <div className="stars-container">
                                        {renderStars(f.teachingGrade)}
                                        <span className="grade-number">({f.teachingGrade}/10)</span>
                                    </div>
                                </div>

                                <div className="grade-item">
                                    <span className="grade-label">Materiale:</span>
                                    <div className="stars-container">
                                        {renderStars(f.materialsGrade)}
                                        <span className="grade-number">({f.materialsGrade}/10)</span>
                                    </div>
                                </div>

                                <div className="grade-item">
                                    <span className="grade-label">Evaluare:</span>
                                    <div className="stars-container">
                                        {renderStars(f.evaluationGrade)}
                                        <span className="grade-number">({f.evaluationGrade}/10)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CitesteFeedback;