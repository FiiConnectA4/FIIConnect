import { useEffect, useState } from 'react';
import './Administrator.css';

const Administrator = () => {
    const [grupe, setGrupe] = useState([]);
    const [selectedGrupa, setSelectedGrupa] = useState('');

    const [cursuri] = useState(['Introducere Programare', 'Programare Avansata']);
    const [selectedCurs, setSelectedCurs] = useState('Introducere Programare');

    const [catalog, setCatalog] = useState([]);
    const [loading, setLoading] = useState(false);

    const mockCatalog = {
        '1A1': [
            { name: 'Flavius Bors', grade: 9 },
            { name: 'Iancu Stefan', grade: 7 },
            { name: 'Inu Maf', grade: 9 },
            { name: 'Yamil Yamal', grade: 10 },
            { name: 'Lanu Maru', grade: 10 },
        ],
        '1A2': [
            { name: 'Alex Moore', grade: 8 },
            { name: 'Bianca White', grade: 6 },
        ],
        '1A3': [],
        '1A4': [],
        '1A5': [],
    };

    // Setează grupele automat din cheile mockCatalog
    useEffect(() => {
        const mockGrupe = Object.keys(mockCatalog);
        setGrupe(mockGrupe);
        setSelectedGrupa(mockGrupe[0]); // selectează prima grupă
    }, []);

    // Când se schimbă grupa sau cursul, încarcă catalogul
    useEffect(() => {
        if (!selectedGrupa) return; // evită erori dacă încă nu e setată grupa
        setLoading(true);
        setTimeout(() => {
            const grupaData = mockCatalog[selectedGrupa] || [];
            setCatalog(grupaData);
            setLoading(false);
        }, 500); // simulare delay
    }, [selectedGrupa, selectedCurs]);

    const handleUploadExcel = () => {
        alert("Upload Excel (mock)");
    };

    const handleDownloadExcel = () => {
        alert("Download Excel (mock)");
    };

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
                    <tr>
                        <th><input type="checkbox" /></th>
                        <th>Student Name</th>
                        <th>Titlu Curs</th>
                        <th>Nota finală</th>
                        <th>Administrative Note</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr><td colSpan="5">Se încarcă...</td></tr>
                    ) : catalog.length === 0 ? (
                        <tr><td colSpan="5">Nicio înregistrare pentru grupa selectată.</td></tr>
                    ) : (
                        catalog.map((item, index) => (
                            <tr key={index}>
                                <td><input type="checkbox" /></td>
                                <td>{item.name}</td>
                                <td>{selectedCurs}</td>
                                <td>{item.grade}</td>
                                <td>
                                    <button className="admin-button" onClick={() => alert(`Deschide fișa pentru ${item.name}`)}>
                                        <img src="/icons/edit-icon.png" alt="Admin Note" className="icon-img" />
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
            </div>
        </div>
    );
};

export default Administrator;
