import { useEffect, useState } from 'react';
import './Profesor.css';

const Profesor = () => {
    const mockCatalog = {
        '2A4': {
            'Introducere Programare': [
                { name: 'Lindsey Stroud', grade: 9 },
                { name: 'Sarah Brown', grade: 7 },
                { name: 'Michael Owen', grade: 9 },
                { name: 'Ivory Jane', grade: 9 },
                { name: 'Peter Odell', grade: 10 }
            ]
        },
        '2A5': {
            'Programare Avansata': [
                { name: 'Ion Popescu', grade: 8 },
                { name: 'Maria Ionescu', grade: 9 }
            ]
        }
    };

    const [grupe, setGrupe] = useState([]);
    const [selectedGrupa, setSelectedGrupa] = useState('');
    const [cursuri, setCursuri] = useState([]);
    const [selectedCurs, setSelectedCurs] = useState('');
    const [catalog, setCatalog] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const availableGrupe = Object.keys(mockCatalog);
        setGrupe(availableGrupe);
        setSelectedGrupa(availableGrupe[0]);
    }, []);

    useEffect(() => {
        if (!selectedGrupa) return;
        const availableCursuri = Object.keys(mockCatalog[selectedGrupa]);
        setCursuri(availableCursuri);
        setSelectedCurs(availableCursuri[0]);
    }, [selectedGrupa]);

    useEffect(() => {
        if (!selectedGrupa || !selectedCurs) return;
        setLoading(true);
        setTimeout(() => {
            const data = mockCatalog[selectedGrupa]?.[selectedCurs] || [];
            setCatalog(data);
            setLoading(false);
        }, 300);
    }, [selectedGrupa, selectedCurs]);

    const handleUploadExcel = () => alert("Upload Excel (mock)");
    const handleDownloadExcel = () => alert("Download Excel (mock)");
    const handleCerereMutare = () => alert("Cerere mutare grupă activitate trimisă (mock)");

    return (
        <div className="container-catalog">
            <div className="catalog-header">
                <h1>CATALOG</h1>
                <div className="select-controls">
                    <select value={selectedGrupa} onChange={e => setSelectedGrupa(e.target.value)}>
                        {grupe.map((g, i) => <option key={i} value={g}>{g}</option>)}
                    </select>

                    <select value={selectedCurs} onChange={e => setSelectedCurs(e.target.value)}>
                        {cursuri.map((c, i) => <option key={i} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            <div className="catalog-table">
                <table>
                    <thead>
                        <tr className='titlu'>
                            <th>Nume student</th>
                            <th>Titlu curs</th>
                            <th>Nota finală</th>
                            <th>Administrative Note</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4">Se încarcă...</td></tr>
                        ) : catalog.length === 0 ? (
                            <tr><td colSpan="4">Nicio înregistrare.</td></tr>
                        ) : (
                            catalog.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{selectedCurs}</td>
                                    <td>{item.grade}</td>
                                    <td>
                                        <button
                                            className="admin-button"
                                            onClick={() => alert(`Deschide fișa pentru ${item.name}`)}
                                        >
                                            <img
                                                src="/icons/edit-icon.png"
                                                alt="Admin Note"
                                                className="icon-img"
                                            />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="catalog-buttons">
                <button onClick={handleUploadExcel}>Upload Excel</button>
                <button onClick={handleDownloadExcel}>Download Excel</button>
                <button onClick={handleCerereMutare}>Cerere mutare grupa activitate</button>
            </div>
        </div>
    );
};

export default Profesor;
