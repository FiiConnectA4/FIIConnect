import React, { useState, useEffect } from 'react';
import './DetaliiCurs.css';
import Ceas from './../Components/Ceas';
import Edit from './../Components/Edit';
import ButonExtensibil from '../Components/ButonExtensibil';

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

    useEffect(() => {
        // Fetch materials
        fetch(`${API_BASE_URL}/didactic/course/material`)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                console.log('Răspuns API pentru materiale:', data);
                setMaterials(Array.isArray(data) ? data.filter(m => m.idCourse === curs.id) : []);
            })
            .catch((err) => {
                console.error('Eroare la încărcarea materialelor:', err);
                alert('Eroare la încărcarea materialelor: ' + err.message);
                setMaterials([]);
            });

        // Fetch professors and userId
        fetch(`${API_BASE_URL}/didactic/course/${curs.id}`)
            .then(response => {
                if (!response.ok) {
                    console.error(`HTTP error! Status: ${response.status}`);
                    setProfesori([]);
                    return {};
                }
                return response.json();
            })
            .then(data => {
                console.log('Răspuns API profesori:', data);
                const professorsArray = data.professors || [];
                console.log('Array profesori:', professorsArray);
                if (Array.isArray(professorsArray) && professorsArray.length > 0) {
                    const profList = professorsArray.map(prof => ({
                        name: `${prof.professor.firstName} ${prof.professor.lastName}`,
                    }));
                    setProfesori(profList);
                    // Set userId from the first professor
                    const professorId = professorsArray[0].professor?.id;
                    if (professorId && !isNaN(professorId)) {
                        setUserId(professorId);
                        console.log('Extracted userId:', professorId);
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
        fetch(`${API_BASE_URL}/didactic/course/${curs.id}/formula`)
    .then(response => {
        if (!response.ok) {
            console.error(`Nicio formulă găsită pentru cursul ${curs.id}`);
            setFormula(null);
            return null;
        }
        return response.json();
    })
    .then(data => {
        console.log('Răspuns API formula:', data);
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
    console.log('📤 Trimitem descriere simplă (text/plain):', description);
    fetch(`${API_BASE_URL}/didactic/course/${curs.id}/description`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: description
    })
        .then(res => {
            console.log('📥 Status răspuns:', res.status);
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.text();
        })
        .then(text => {
            console.log('Răspuns complet:', text);
            alert('Descriere salvată!');
            setIsEditingDescription(false);
        })
        .catch(err => {
            console.error('⛔ Eroare la salvarea descrierii:', err);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log('Formula salvată:', data);
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

const addMaterial = () => {
    if (!newMaterialFile) {
        alert('Vă rugăm să selectați un fișier pentru încărcare');
        return;
    }

    if (!userId || isNaN(userId)) {
        alert('Eroare: ID-ul profesorului nu este disponibil. Vă rugăm să reîncărcați pagina sau să contactați suportul.');
        return;
    }

    const formData = new FormData();
    formData.append('file', newMaterialFile);
    formData.append('idCourse', curs.id);
    formData.append('idProf', userId);

    fetch(`${API_BASE_URL}/didactic/course/material`, {
        method: 'POST',
        body: formData
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
            return fetch(`${API_BASE_URL}/didactic/course/material/${materialId}`);
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(newMaterial => {
            setMaterials(prev => [...prev, newMaterial]);
            setNewMaterialFile(null);
            document.getElementById('fileInput').value = '';
            alert('Material încărcat cu succes!');
        })
        .catch(err => {
            console.error('Eroare la încărcarea materialului:', err);
            alert('Eroare la încărcarea materialului: ' + err.message);
        });
};

const downloadMaterial = (materialId, filename) => {
    fetch(`${API_BASE_URL}/didactic/course/material/${materialId}/file`)
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
    fetch(`${API_BASE_URL}/didactic/course/material/${materialId}`, { method: 'DELETE' })
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
    if (!newFilename || newFilename.trim() === '') {
        alert('Numele fișierului nu poate fi gol');
        return;
    }

    fetch(`${API_BASE_URL}/didactic/course/material/${renameMaterialId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'text/plain' },
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

if (loading) return <div>Se încarcă cursul...</div>;

return (
    <div className="detalii-container">
        <button className="buton-inapoi" onClick={onBack}>{'< Înapoi'}</button>
        <div className="titlu-curs">
            <h1><u>{curs.title}</u></h1>
            <Ceas />
        </div>
        <ButonExtensibil text="Profesori" professors={profesori} />

        <div className="sectiune">
            <h2>Descriere:</h2>
            {isEditingDescription ? (
                <div>
                    <Edit
                        value={description}
                        onChange={(newDescription) => setDescription(newDescription)}
                    />
                    <button onClick={saveCourseChanges}>Salvează</button>
                    <button onClick={() => setIsEditingDescription(false)}>Anulează</button>
                </div>
            ) : (
                <div>
                    <p>{description || 'Fără descriere'}</p>
                    <button onClick={() => setIsEditingDescription(true)}>Editează</button>
                </div>
            )}
        </div>

        <div className="sectiune">
            <h2>Metoda de notare:</h2>
            {isEditingFormula ? (
                <div>
                    <input
                        type="text"
                        value={formulaText}
                        onChange={(e) => setFormulaText(e.target.value)}
                        placeholder="ex. Notă finală = laborator + examen"
                    />
                    <button onClick={saveFormula}>Salvează</button>
                    <button onClick={() => setIsEditingFormula(false)}>Anulează</button>
                </div>
            ) : (
                <div>
                    <p>{formula?.text || 'Fără formulă definită'}</p>
                    {formula?.components?.length > 0 && (
                        <ul>
                            {formula.components.map(comp => (
                                <li key={comp.id}>{comp.name}</li>
                            ))}
                        </ul>
                    )}
                    <button onClick={() => setIsEditingFormula(true)}>Editează</button>
                </div>
            )}
        </div>

        <div className="sectiune bibliografie">
            <h2>Materiale (Resurse):</h2>
            {materials.length > 0 ? (
                materials.map((m) => (
                    <div key={m.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        {renameMaterialId === m.id ? (
                            <div>
                                <input
                                    type="text"
                                    value={newFilename}
                                    onChange={(e) => setNewFilename(e.target.value)}
                                    placeholder="Nume nou fișier"
                                />
                                <button onClick={saveNewFilename}>Salvează</button>
                                <button onClick={cancelRename}>Anulează</button>
                            </div>
                        ) : (
                            <>
                                <span>{m.filename}</span>
                                <button
                                    style={{ marginLeft: '10px' }}
                                    onClick={() => downloadMaterial(m.id, m.filename)}
                                >
                                    Descarcă
                                </button>
                                <button
                                    style={{ marginLeft: '10px' }}
                                    onClick={() => startRenameMaterial(m.id, m.filename)}
                                >
                                    Redenumește
                                </button>
                                <button
                                    className="stergere"
                                    style={{ marginLeft: '10px' }}
                                    onClick={() => deleteMaterial(m.id)}
                                >
                                    Șterge
                                </button>
                            </>
                        )}
                    </div>
                ))
            ) : (
                <p>Fără materiale disponibile</p>
            )}
            <div style={{ marginTop: '20px' }}>
                <h3>Încarcă material nou:</h3>
                <input
                    id="fileInput"
                    type="file"
                    onChange={(e) => setNewMaterialFile(e.target.files[0])}
                    disabled={!userId}
                />
                <button onClick={addMaterial} disabled={!newMaterialFile || !userId}>
                    Încarcă
                </button>
            </div>
        </div>
    </div>
);
};

export default PDetaliiCurs;