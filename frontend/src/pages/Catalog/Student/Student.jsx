import { useEffect, useState } from 'react';
import './Student.css';

const Student = () => {
    const mockCatalog = {
        'Semestrul 1': [
            { curs: 'Introducere Programare', profesor: 'Cristian Simionescu', credite: 6, nota: 9 },
            { curs: 'Programare Avansata', profesor: 'Cristian Simionescu', credite: 5, nota: 10 },
            { curs: 'Ingineria Programarii', profesor: 'Cristian Simionescu', credite: 4, nota: 10 },
            { curs: 'Introducere Programare', profesor: 'Cristian Simionescu', credite: 6, nota: 7 },
            { curs: 'Programare Avansata', profesor: 'Cristian Simionescu', credite: 5, nota: 8 }
        ],
        'Semestrul 2': [
            { curs: 'Matematică Avansata', profesor: 'Ion Georgescu', credite: 4, nota: 10 },
            { curs: 'Structuri de Date', profesor: 'Maria Popa', credite: 6, nota: 9 }
        ]
    };

    const [semestre, setSemestre] = useState([]);
    const [selectedSemestru, setSelectedSemestru] = useState('');
    const [catalog, setCatalog] = useState([]);
    const [punctajFinal, setPunctajFinal] = useState(0);
    const [mediaFinala, setMediaFinala] = useState(0);

    useEffect(() => {
        const keys = Object.keys(mockCatalog);
        setSemestre(keys);
        setSelectedSemestru(keys[0]);
    }, []);

    useEffect(() => {
        if (!selectedSemestru) return;
        const cursuri = mockCatalog[selectedSemestru];
        setCatalog(cursuri);

        const totalPunctaj = cursuri.reduce((acc, c) => acc + c.credite * c.nota, 0);
        const totalCredite = cursuri.reduce((acc, c) => acc + c.credite, 0);
        setPunctajFinal(totalPunctaj);
        setMediaFinala(totalCredite ? (totalPunctaj / totalCredite).toFixed(2) : 0);
    }, [selectedSemestru]);

    const handleDownload = () => alert('Download Excel (mock)');
    const handleCerereMutare = () => alert('Cerere mutare grupă activitate trimisă (mock)');

    return (
        <div className="container-catalog">
            <div className="catalog-header">
                <h1>CATALOG</h1>
                <div className="select-controls">
                    <select value={selectedSemestru} onChange={e => setSelectedSemestru(e.target.value)}>
                        {semestre.map((sem, i) => (
                            <option key={i} value={sem}>{sem}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="catalog-table">
                <table>
                    <thead>
                    <tr>
                        <th>Curs</th>
                        <th>Nume profesor</th>
                        <th>Credite</th>
                        <th>Nota</th>
                        <th>Fișa Activitate</th>
                    </tr>
                    </thead>
                    <tbody>
                    {catalog.map((curs, index) => (
                        <tr key={index}>
                            <td>{curs.curs}</td>
                            <td>{curs.profesor}</td>
                            <td>{curs.credite}</td>
                            <td>{curs.nota}</td>
                            <td>
                                <button className="admin-button" onClick={() => alert(`Deschide fișa pentru ${curs.curs}`)}>
                                    <img src="/icons/edit-icon.png" alt="Fisa" className="icon-img" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="catalog-footer">
                <button onClick={handleDownload}>Download Excel</button>
                <div className="stats">
                    <p><strong>Punctaj final:</strong> {punctajFinal}</p>
                    <p><strong>Media finală:</strong> {mediaFinala}</p>
                </div>
                <button onClick={handleCerereMutare}>Cerere mutare grupa activitate</button>
            </div>
        </div>
    );
};

export default Student;
