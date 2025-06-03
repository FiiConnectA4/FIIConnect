import React, { useState, useEffect } from 'react';
import './DetaliiCurs.css';
import Ceas from './../Components/Ceas';
import Buton from './../Components/Buton';
import ButonExtensibil from '../Components/ButonExtensibil';
import TrimiteFeedback from './TrimiteFeedback';

// Backend base URL (remove if using package.json proxy)
const API_BASE_URL = ''; // Setează dacă nu folosești proxy

const DetaliiCurs = ({ curs, onBack }) => {
    const [profesori, setProfesori] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [formula, setFormula] = useState(null);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);

    // Acesta controlează dacă afișăm pagina de feedback sau detaliile cursului
    const [showFeedback, setShowFeedback] = useState(false);

    const token = localStorage.getItem('token');

    useEffect(() => {
        console.log('ID-ul cursului:', curs.id);

        // Fetch materials
        fetch(`${API_BASE_URL}/didactic/course/material`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                setMaterials(Array.isArray(data) ? data.filter(m => m.idCourse === curs.id) : []);
            })
            .catch(err => {
                console.error('Eroare la încărcarea materialelor:', err);
                alert('Eroare la încărcarea materialelor: ' + err.message);
                setMaterials([]);
            });

        // Fetch professors and description
        fetch(`${API_BASE_URL}/didactic/course/${curs.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) {
                    console.error(`HTTP error! Status: ${res.status}`);
                    setProfesori([]);
                    setDescription('');
                    return {};
                }
                return res.json();
            })
            .then(data => {
                const professorsArray = data.professors || [];
                if (Array.isArray(professorsArray)) {
                    const profList = professorsArray.map(prof => ({
                        name: `${prof.professor.firstName} ${prof.professor.lastName}`,
                    }));
                    setProfesori(profList);
                } else {
                    console.error('Răspuns invalid: nu conține un array de profesori.', data);
                    setProfesori([]);
                }
                setDescription(data.description || 'Fără descriere');
            })
            .catch(err => {
                console.error('Eroare la încărcarea profesorilor:', err);
                alert('Eroare la încărcarea profesorilor: ' + err.message);
                setProfesori([]);
                setDescription('Fără descriere');
            });

        // Fetch formula
        fetch(`${API_BASE_URL}/didactic/course/${curs.id}/formula`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) {
                    console.error(`Nicio formulă găsită pentru cursul ${curs.id}`);
                    setFormula(null);
                    return null;
                }
                return res.json();
            })
            .then(data => {
                setFormula(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Eroare la încărcarea formulei:', err);
                alert('Eroare la încărcarea formulei: ' + err.message);
                setFormula(null);
                setLoading(false);
            });
    }, [curs.id, token]);

    const downloadMaterial = (materialId, filename) => {
        fetch(`${API_BASE_URL}/didactic/course/material/${materialId}/file`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) {
                    return res.text().then(text => {
                        throw new Error(`HTTP error! Status: ${res.status}, Message: ${text}`);
                    });
                }
                return res.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            })
            .catch(err => {
                console.error('Eroare la descărcarea materialului:', err);
                alert('Eroare la descărcarea materialului: ' + err.message);
            });
    };

    // Dacă showFeedback e true, afișăm componentea de feedback în locul detaliilor
    if (showFeedback) {
        return <TrimiteFeedback onBack={() => setShowFeedback(false)} />;
    }

    if (loading) {
        return <div className="loading">Se încarcă detaliile cursului...</div>;
    }

    return (
        <div className="detalii-container">
            {/* Header Section */}
            <div className="header-section">
                <button className="buton-inapoi" onClick={onBack}>
                    ← Înapoi la cursuri
                </button>
                <Ceas />
            </div>

            {/* Course Title Section */}
            <div className="course-title-section">
                <h1>{curs.title}</h1>
                <button
                    className="buton-feedback"
                    onClick={() => setShowFeedback(true)}
                >
                    Feedback
                </button>
            </div>

            {/* Professors Section */}
            <div className="grid-item professors-section">
                <h2>Profesori</h2>
                <div className="professors-list">
                    {profesori.length > 0 ? (
                        profesori.map((prof, index) => (
                            <span key={index} className="professor-badge">
                                {prof.name}
                            </span>
                        ))
                    ) : (
                        <span className="professor-badge">Niciun profesor asociat</span>
                    )}
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="content-grid">
                {/* Description Section */}
                <div className="grid-item description-section">
                    <h2>Descriere Curs</h2>
                    <div
                        className="description-textarea"
                        style={{
                            padding: '20px',
                            minHeight: '150px',
                            border: '2px solid rgba(83, 122, 156, 0.15)',
                            borderRadius: '15px',
                            background: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '16px',
                            lineHeight: '1.6',
                            color: '#1a355e'
                        }}
                    >
                        {description}
                    </div>
                </div>

                {/* Formula Section */}
                <div className="grid-item formula-section">
                    <h2>Metodă de Notare</h2>
                    <div className="formula-display">
                        {formula?.text || 'Nicio metodă de notare definită'}
                    </div>
                    {formula?.components?.length > 0 && (
                        <div className="formula-components">
                            <strong>Componente:</strong>
                            <ul>
                                {formula.components.map(comp => (
                                    <li key={comp.id}>{comp.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Materials Section */}
            <div className="grid-item materials-section">
                <h2>Materiale de Curs</h2>

                {materials.length > 0 ? (
                    <div className="materials-grid">
                        {materials.map(material => (
                            <div key={material.id} className="material-card">
                                <div className="material-name">{material.filename}</div>
                                <div className="material-actions">
                                    <button
                                        className="btn-primary"
                                        onClick={() => downloadMaterial(material.id, material.filename)}
                                    >
                                        📥 Descarcă
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-materials">
                        📚 Nu există materiale încărcate pentru acest curs
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetaliiCurs;
