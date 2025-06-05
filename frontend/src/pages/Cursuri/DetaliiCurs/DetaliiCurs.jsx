import React, { useState, useEffect } from 'react';
import './DetaliiCurs.css';
import Ceas from './../Components/Ceas';
import TrimiteFeedback from './TrimiteFeedback';

const API_BASE_URL = ''; // setează dacă nu folosești proxy

const DetaliiCurs = ({ curs, studentId, onBack }) => {
    const [profesori, setProfesori] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [formula, setFormula] = useState(null);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [feedbackAllowed, setFeedbackAllowed] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [professorId, setProfessorId] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [materialsRes, courseRes, formulaRes, feedbackRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/didactic/course/material`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${API_BASE_URL}/didactic/course/${curs.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${API_BASE_URL}/didactic/course/${curs.id}/formula`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${API_BASE_URL}/didactic/globals/feedbacksAllowed`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                // Materials
                const materialsData = await materialsRes.json();
                setMaterials(
                    Array.isArray(materialsData)
                        ? materialsData.filter((m) => m.idCourse === curs.id)
                        : []
                );

                // Course Details
                const courseData = await courseRes.json();
                const profList = courseData.professors || [];
                const parsedProfs = profList.map((p) => ({
                    id: p.professor.id,
                    name: `${p.professor.firstName} ${p.professor.lastName}`,
                }));
                setProfesori(parsedProfs);
                setProfessorId(parsedProfs[0]?.id || null);
                setDescription(courseData.description || 'Fără descriere');

                // Formula
                if (formulaRes.ok) {
                    const formulaData = await formulaRes.json();
                    setFormula(formulaData);
                }

                // Feedback allowed
                const feedbackData = await feedbackRes.json();
                setFeedbackAllowed(feedbackData?.value === 'true' || feedbackData === true);
            } catch (err) {
                console.error('Eroare la încărcarea datelor:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [curs.id, token]);

    const downloadMaterial = (materialId, filename) => {
        fetch(`${API_BASE_URL}/didactic/course/material/${materialId}/file`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error(`Eroare: ${res.status}`);
                return res.blob();
            })
            .then((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
            })
            .catch((err) => {
                console.error('Eroare la descărcare:', err);
                alert('Eroare la descărcarea fișierului.');
            });
    };

    if (loading) {
        return <div className="loading">Se încarcă detaliile cursului...</div>;
    }

    if (showFeedback) {
        return (
            <TrimiteFeedback
                curs={{ ...curs, professorId }}
                studentId={studentId}
                onBack={() => setShowFeedback(false)}
            />
        );
    }

    return (
        <div className="detalii-container">
            <div className="header-section">
                <button className="buton-inapoi" onClick={onBack}>← Înapoi</button>
                <Ceas />
            </div>

            <div className="course-title-section">
                <h1>{curs.title}</h1>
                {feedbackAllowed && professorId && (
                    <button className="buton-feedback" onClick={() => setShowFeedback(true)}>
                        Feedback
                    </button>
                )}
            </div>

            <div className="grid-item professors-section">
                <h2>Profesori</h2>
                <div className="professors-list">
                    {profesori.length > 0 ? (
                        profesori.map((prof, idx) => (
                            <span key={idx} className="professor-badge">{prof.name}</span>
                        ))
                    ) : (
                        <span className="professor-badge">Niciun profesor asociat</span>
                    )}
                </div>
            </div>

            <div className="content-grid">
                <div className="grid-item description-section">
                    <h2>Descriere Curs</h2>
                    <div className="description-textarea">{description}</div>
                </div>

                <div className="grid-item formula-section">
                    <h2>Metodă de Notare</h2>
                    <div className="formula-display">
                        {formula?.text || 'Nicio metodă de notare definită'}
                    </div>
                    {formula?.components?.length > 0 && (
                        <ul className="formula-components">
                            {formula.components.map((c) => (
                                <li key={c.id}>{c.name}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="grid-item materials-section">
                <h2>Materiale de Curs</h2>
                {materials.length > 0 ? (
                    <div className="materials-grid">
                        {materials.map((m) => (
                            <div key={m.id} className="material-card">
                                <div className="material-name">{m.filename}</div>
                                <div className="material-actions">
                                    <button
                                        className="btn-primary"
                                        onClick={() => downloadMaterial(m.id, m.filename)}
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