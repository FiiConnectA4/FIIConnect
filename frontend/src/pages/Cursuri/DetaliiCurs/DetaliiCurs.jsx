import React, { useState, useEffect } from 'react';
import './DetaliiCurs.css';
import Ceas from './../Components/Ceas';
import TrimiteFeedback from './TrimiteFeedback';

const API_BASE_URL = ''; // Dacă nu folosești proxy

const DetaliiCurs = ({ curs, onBack }) => {
    const [profesori, setProfesori] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [formula, setFormula] = useState(null);
    const [description, setDescription] = useState('');
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [loadingFeedback, setLoadingFeedback] = useState(true);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackAllowed, setFeedbackAllowed] = useState(false);

    const token = localStorage.getItem('token');

    useEffect(() => {
        // Fetch detalii curs
        const fetchCourseDetails = async () => {
            try {
                const [materialsRes, courseRes, formulaRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/didactic/course/material`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${API_BASE_URL}/didactic/course/${curs.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${API_BASE_URL}/didactic/course/${curs.id}/formula`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                // MATERIALS
                const materialsData = await materialsRes.json();
                setMaterials(
                    Array.isArray(materialsData)
                        ? materialsData.filter((m) => m.idCourse === curs.id)
                        : []
                );

                // COURSE INFO
                const courseData = await courseRes.json();
                const profArray = courseData.professors || [];
                setProfesori(
                    Array.isArray(profArray)
                        ? profArray.map((p) => ({
                            name: `${p.professor.firstName} ${p.professor.lastName}`,
                        }))
                        : []
                );
                setDescription(courseData.description || 'Fără descriere');

                // FORMULA
                if (formulaRes.ok) {
                    const formulaData = await formulaRes.json();
                    setFormula(formulaData);
                } else {
                    setFormula(null);
                }

                setLoadingDetails(false);
            } catch (err) {
                console.error('Eroare la încărcarea detaliilor cursului:', err);
                setLoadingDetails(false);
            }
        };

        // Fetch feedback status
        const fetchFeedbackStatus = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/didactic/globals/feedbacksAllowed`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                console.log('🧪 feedbacksAllowed response:', data);
                const allowed = data?.value === "true";  // interpretare corectă a stringului "true"
                setFeedbackAllowed(allowed);
            } catch (err) {
                console.error('Eroare la statusul feedback:', err);
                setFeedbackAllowed(false);
            } finally {
                setLoadingFeedback(false);
            }
        };

        fetchCourseDetails();
        fetchFeedbackStatus();
    }, [curs.id, token]);

    const downloadMaterial = (materialId, filename) => {
        fetch(`${API_BASE_URL}/didactic/course/material/${materialId}/file`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) {
                    return res.text().then((text) => {
                        throw new Error(`HTTP error! Status: ${res.status}, Message: ${text}`);
                    });
                }
                return res.blob();
            })
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            })
            .catch((err) => {
                console.error('Eroare la descărcarea materialului:', err);
                alert('Eroare: ' + err.message);
            });
    };

    if (showFeedback) {
        return <TrimiteFeedback onBack={() => setShowFeedback(false)} />;
    }

    if (loadingDetails || loadingFeedback) {
        return <div className="loading">Se încarcă detaliile cursului...</div>;
    }

    return (
        <div className="detalii-container">
            {/* Header */}
            <div className="header-section">
                <button className="buton-inapoi" onClick={onBack}>
                    ← Înapoi la cursuri
                </button>
                <Ceas />
            </div>

            {/* Titlu și Feedback */}
            <div className="course-title-section">
                <h1>{curs.title}</h1>
                {feedbackAllowed && (
                    <button className="buton-feedback" onClick={() => setShowFeedback(true)}>
                        Feedback
                    </button>
                )}
            </div>

            {/* Profesori */}
            <div className="grid-item professors-section">
                <h2>Profesori</h2>
                <div className="professors-list">
                    {profesori.length > 0 ? (
                        profesori.map((prof, idx) => (
                            <span key={idx} className="professor-badge">
                                {prof.name}
                            </span>
                        ))
                    ) : (
                        <span className="professor-badge">Niciun profesor asociat</span>
                    )}
                </div>
            </div>

            {/* Descriere și Formula */}
            <div className="content-grid">
                <div className="grid-item description-section">
                    <h2>Descriere Curs</h2>
                    <div className="description-textarea">
                        {description}
                    </div>
                </div>

                <div className="grid-item formula-section">
                    <h2>Metodă de Notare</h2>
                    <div className="formula-display">
                        {formula?.text || 'Nicio metodă de notare definită'}
                    </div>
                    {formula?.components?.length > 0 && (
                        <div className="formula-components">
                            <strong>Componente:</strong>
                            <ul>
                                {formula.components.map((comp) => (
                                    <li key={comp.id}>{comp.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Materiale */}
            <div className="grid-item materials-section">
                <h2>Materiale de Curs</h2>
                {materials.length > 0 ? (
                    <div className="materials-grid">
                        {materials.map((material) => (
                            <div key={material.id} className="material-card">
                                <div className="material-name">{material.filename}</div>
                                <div className="material-actions">
                                    <button
                                        className="btn-primary"
                                        onClick={() =>
                                            downloadMaterial(material.id, material.filename)
                                        }
                                    >
                                        📥 Descarcă
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-materials">📚 Nu există materiale pentru acest curs</div>
                )}
            </div>
        </div>
    );
};

export default DetaliiCurs;