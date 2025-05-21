import React, { useState, useEffect, useRef } from 'react';
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
    const fileInputRef = useRef(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        // Fetch materials
        fetch(`${API_BASE_URL}/didactic/course/material`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setMaterials(Array.isArray(data) ? data.filter(m => m.idCourse === curs.id) : []);
            })
            .catch((err) => {
                console.error('Eroare la încărcarea materialelor:', err);
                alert('Eroare la încărcarea materialelor: ' + err.message);
                setMaterials([]);
            });

        // Fetch professors and userId
        fetch(`${API_BASE_URL}/didactic/course/${curs.id}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
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
        fetch(`${API_BASE_URL}/didactic/course/${curs.id}/formula`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
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
                'Content-Type': 'text/plain',
                Authorization: `Bearer ${token}`
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
        console.log(isExistingFormula);
        console.log(formula);
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

    const addMaterial = (file) => {
        if (!file) {
            alert('Vă rugăm să selectați un fișier pentru încărcare');
            return;
        }

        if (!userId || isNaN(userId)) {
            alert('Eroare: ID-ul profesorului nu este disponibil. Vă rugăm să reîncărcați pagina sau să contactați suportul.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('idCourse', curs.id);
        formData.append('idProf', userId);

        fetch(`${API_BASE_URL}/didactic/course/material`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`
            }
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
                return fetch(`${API_BASE_URL}/didactic/course/material/${materialId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
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
        fetch(`${API_BASE_URL}/didactic/course/material/${materialId}/file`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
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

            headers: {
                'Authorization': `Bearer ${token}`
            }
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
        if (!newFilename || newFilename.trim() === '') {
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
                        <button className='buton-sectiune' onClick={saveCourseChanges}>Salvează</button>
                        <button className='buton-sectiune' onClick={() => setIsEditingDescription(false)}>Anulează</button>
                    </div>
                ) : (
                    <div>
                        <p>{description || 'Fără descriere'}</p>
                        <button className='buton-sectiune' onClick={() => setIsEditingDescription(true)}>Editează</button>
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
                        <button className='buton-sectiune' onClick={saveFormula}>Salvează</button>
                        <button className='buton-sectiune' onClick={() => setIsEditingFormula(false)}>Anulează</button>
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
                        <button className='buton-sectiune' onClick={() => setIsEditingFormula(true)}>Editează</button>
                    </div>
                )}
            </div>

            <div className="sectiune bibliografie">
                <h2>Materiale (Resurse):</h2>
                {materials.length > 0 ? (
                    <div>
                        {materials.map((m) => (
                            <div
                                key={m.id}
                                style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}
                            >
                                {renameMaterialId === m.id ? (
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <input
                                            type="text"
                                            value={newFilename}
                                            onChange={(e) => setNewFilename(e.target.value)}
                                            placeholder="Nume nou fișier"
                                            style={{ marginRight: '10px' }}
                                        />
                                        <button className='buton-sectiune' onClick={saveNewFilename}>Salvează</button>
                                        <button
                                            className='buton-sectiune'
                                            onClick={cancelRename}
                                        >
                                            Anulează
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ flex: 1 }}>{m.filename}</span>
                                        <div style={{ display: 'flex' }}>
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
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Fără materiale disponibile</p>
                )}
                <div style={{ marginTop: '20px' }}>
                    <button
                        onClick={handleIconClick}
                        style={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            fontSize: '24px',
                            cursor: userId ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        disabled={!userId}
                        title="Încarcă material nou"
                    >
                        +
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