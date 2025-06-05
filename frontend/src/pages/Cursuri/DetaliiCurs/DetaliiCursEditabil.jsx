import React, { useState, useEffect, useRef } from 'react';
import './DetaliiCurs.css';
import Ceas from './../Components/Ceas';
import SwitchToggle from './../Components/SwitchToggle';
import Edit from './../Components/Edit';
import ButonExtensibil from '../Components/ButonExtensibil';
import CitesteFeedback from './CitesteFeedback'; // ≪ import nou ≫
import { useNavigate } from 'react-router-dom';

// Backend base URL (remove if using package.json proxy)
const API_BASE_URL = ''; // Set to 'http://localhost:8080' if no proxy, or leave empty with proxy

const PDetaliiCurs = ({ curs, onBack }) => {
    const [materials, setMaterials] = useState([]);
    const [gradingMethod, setGradingMethod] = useState('');
    const [description, setDescription] = useState('');
    const [newMaterialFile, setNewMaterialFile] = useState(null);
    const [profesori, setProfesori] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formula, setFormula] = useState(null);
    const [isEditingFormula, setIsEditingFormula] = useState(false);
    const [formulaText, setFormulaText] = useState('');
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [renameMaterialId, setRenameMaterialId] = useState(null);
    const [newFilename, setNewFilename] = useState('');
    const [userId, setUserId] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false); // ≪ stare nouă ≫

    const fileInputRef = useRef(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
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

        // Fetch professors and userId
        fetch(`${API_BASE_URL}/didactic/course/${curs.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                if (!response.ok) {
                    console.error(`HTTP error! Status: ${response.status}`);
                    setProfesori([]);
                    return {};
                }
                return response.json();
            })
            .then(data => {
                const professorsArray = data.professors || [];
                if (Array.isArray(professorsArray) && professorsArray.length > 0) {
                    const profList = professorsArray.map(prof => ({
                        name: `${prof.professor.firstName} ${prof.professor.lastName}`,
                    }));
                    setProfesori(profList);
                    // Set userId from the first professor
                    const professorId = professorsArray[0].professor?.id;
                    if (professorId && !isNaN(professorId)) {
                        setUserId(professorId);
                    } else {
                        console.error('No valid professor ID found in professors array');
                        setUserId(null);
                    }
                } else {
                    console.error('Răspuns invalid: nu conține un array de profesori.', data);
                    setProfesori([]);
                    setUserId(null);
                }
                setDescription(data.description || '');
            })
            .catch(error => {
                console.error('Eroare la încărcarea profesorilor:', error);
                alert('Eroare la încărcarea profesorilor: ' + error.message);
                setProfesori([]);
                setUserId(null);
            });

        // Fetch formula
        fetch(`${API_BASE_URL}/didactic/course/${curs.id}/formula`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                if (!response.ok) {
                    console.error(`Nicio formulă găsită pentru cursul ${curs.id}`);
                    setFormula(null);
                    return null;
                }
                return response.json();
            })
            .then(data => {
                setFormula(data);
                setFormulaText(data?.text || '');
                setGradingMethod(data?.text || '');
                setLoading(false);
            })
            .catch(error => {
                console.error('Eroare la încărcarea formulei:', error);
                alert('Eroare la încărcarea formulei: ' + error.message);
                setFormula(null);
                setLoading(false);
            });
    }, [curs.id]);

    const saveCourseChanges = () => {
        fetch(`${API_BASE_URL}/didactic/course/${curs.id}/description`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'text/plain',
                Authorization: `Bearer ${token}`
            },
            body: description
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                return res.text();
            })
            .then(() => {
                alert('Descriere salvată!');
                setIsEditingDescription(false);
            })
            .catch(err => {
                console.error('Eroare la salvarea descrierii:', err);
                alert('Eroare la salvarea descrierii: ' + err.message);
            });
    };

    const saveFormula = () => {
        const requestBody = {
            idCourse: curs.id,
            text: formulaText
        };
        const isExistingFormula = formula && formula.id;
        fetch(`${API_BASE_URL}${isExistingFormula ? `/didactic/formula/${formula.id}` : '/didactic/formula'}`, {
            method: isExistingFormula ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(requestBody)
        })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                setFormula(data);
                setGradingMethod(data.text);
                setIsEditingFormula(false);
                alert('Formula salvată!');
            })
            .catch(err => {
                console.error('Eroare la salvarea formulei:', err);
                alert('Eroare la salvarea formulei: ' + err.message);
            });
    };

    const addMaterial = (file) => {
        if (!file) {
            alert('Vă rugăm să selectați un fișier pentru încărcare');
            return;
        }
        if (!userId || isNaN(userId)) {
            alert('Eroare: ID-ul profesorului nu este disponibil. Vă rugăm să reîncărcați pagina sau să contactați suportul.');
            return;
        }
        const formDataObj = new FormData();
        formDataObj.append('file', file);
        formDataObj.append('idCourse', curs.id);
        formDataObj.append('idProf', userId);

        fetch(`${API_BASE_URL}/didactic/course/material`, {
            method: 'POST',
            body: formDataObj,
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`HTTP error! Status: ${response.status}, Message: ${text}`);
                    });
                }
                return response.headers.get('Location');
            })
            .then(location => {
                const materialId = location.split('/').pop();
                return fetch(`${API_BASE_URL}/didactic/course/material/${materialId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then(newMaterial => {
                setMaterials(prev => [...prev, newMaterial]);
                setNewMaterialFile(null);
                fileInputRef.current.value = '';
                alert('Material încărcat cu succes!');
            })
            .catch(err => {
                console.error('Eroare la încărcarea materialului:', err);
                alert('Eroare la încărcarea materialului: ' + err.message);
            });
    };

    const downloadMaterial = (materialId, filename) => {
        fetch(`${API_BASE_URL}/didactic/course/material/${materialId}/file`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`HTTP error! Status: ${response.status}, Message: ${text}`);
                    });
                }
                return response.blob();
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

    const deleteMaterial = (materialId) => {
        fetch(`${API_BASE_URL}/didactic/course/material/${materialId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`HTTP error! Status: ${response.status}, Message: ${text}`);
                    });
                }
                setMaterials(prev => prev.filter(m => m.id !== materialId));
                alert('Material șters cu succes!');
            })
            .catch(err => {
                console.error('Eroare la ștergerea materialului:', err);
                alert('Eroare la ștergerea materialului: ' + err.message);
            });
    };

    const startRenameMaterial = (materialId, currentFilename) => {
        setRenameMaterialId(materialId);
        setNewFilename(currentFilename);
    };

    const saveNewFilename = () => {
        if (!newFilename.trim()) {
            alert('Numele fișierului nu poate fi gol');
            return;
        }
        fetch(`${API_BASE_URL}/didactic/course/material/${renameMaterialId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'text/plain',
                Authorization: `Bearer ${token}`
            },
            body: newFilename.trim()
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`HTTP error! Status: ${response.status}, Message: ${text}`);
                    });
                }
                setMaterials(prev =>
                    prev.map(m =>
                        m.id === renameMaterialId ? { ...m, filename: newFilename.trim() } : m
                    )
                );
                setRenameMaterialId(null);
                setNewFilename('');
                alert('Numele fișierului a fost actualizat!');
            })
            .catch(err => {
                console.error('Eroare la redenumirea materialului:', err);
                alert('Eroare la redenumirea materialului: ' + err.message);
            });
    };

    const cancelRename = () => {
        setRenameMaterialId(null);
        setNewFilename('');
    };

    const handleIconClick = () => {
        if (userId) {
            fileInputRef.current.click();
        } else {
            alert('Eroare: ID-ul profesorului nu este disponibil. Vă rugăm să reîncărcați pagina sau să contactați suportul.');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewMaterialFile(file);
            addMaterial(file);
        }
    };

    if (showFeedback) {
        // Afișăm componenta CitesteFeedback și trimitem onBack pentru revenire
        return <CitesteFeedback onBack={() => setShowFeedback(false)} />;
    }

    if (loading) {
        return <div className="loading">Se încarcă cursul...</div>;
    }

    return (
        <div className="detalii-container">
            {/* Header Section */}
            <div className="header-section">
                <button className="buton-inapoi" onClick={onBack}>
                    ← Înapoi la cursuri
                </button>
                <Ceas
                    onClick={() => {
                        const disciplina = encodeURIComponent(curs.title);
                        navigate(`/app/orar/discipline/${disciplina}`);
                    }}
                />
            </div>

            {/* Course Title Section */}
            <div className="course-title-section">
                <h1>{curs.title}</h1>

                <button
                    className="buton-feedback"
                    onClick={() => setShowFeedback(true)}
                >
                    Feedback-uri
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
                    <textarea
                        className="description-textarea"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        onBlur={saveCourseChanges}
                        placeholder="Introduceți o descriere detaliată a cursului..."
                        rows={8}
                    />
                </div>

                {/* Formula Section */}
                <div className="grid-item formula-section">
                    <h2>Metodă de Notare</h2>
                    {isEditingFormula ? (
                        <div>
                            <input
                                type="text"
                                className="formula-input"
                                value={formulaText}
                                onChange={e => setFormulaText(e.target.value)}
                                placeholder="ex. Notă finală = 0.4 * Laborator + 0.6 * Examen"
                            />
                            <div>
                                <button className="btn-primary" onClick={saveFormula}>
                                    Salvează Formula
                                </button>
                                <button className="btn-secondary" onClick={() => setIsEditingFormula(false)}>
                                    Anulează
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
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
                            <button className="btn-primary" onClick={() => setIsEditingFormula(true)}>
                                Editează Formula
                            </button>
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
                                {renameMaterialId === material.id ? (
                                    <div>
                                        <input
                                            type="text"
                                            className="material-rename-input"
                                            value={newFilename}
                                            onChange={e => setNewFilename(e.target.value)}
                                            placeholder="Nume nou pentru fișier"
                                        />
                                        <div className="material-actions">
                                            <button className="btn-primary" onClick={saveNewFilename}>
                                                Salvează
                                            </button>
                                            <button className="btn-secondary" onClick={cancelRename}>
                                                Anulează
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="material-name">{material.filename}</div>
                                        <div className="material-actions">
                                            <button
                                                className="btn-primary"
                                                onClick={() => downloadMaterial(material.id, material.filename)}
                                            >
                                                📥 Descarcă
                                            </button>
                                            <button
                                                className="btn-secondary"
                                                onClick={() => startRenameMaterial(material.id, material.filename)}
                                            >
                                                ✏️ Redenumește
                                            </button>
                                            <button
                                                className="btn-danger"
                                                onClick={() => deleteMaterial(material.id)}
                                            >
                                                🗑️ Șterge
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-materials">
                        📚 Nu există materiale încărcate pentru acest curs
                    </div>
                )}

                {/* Upload Section */}
                <div className="upload-section" onClick={handleIconClick}>
                    <button
                        className="upload-button"
                        disabled={!userId}
                        title={userId ? "Încarcă material nou" : "ID-ul profesorului nu este disponibil"}
                    >
                        Încarcă Material Nou
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default PDetaliiCurs;
