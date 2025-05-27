import { useEffect, useState } from 'react';
import './Administrator.css';

const Administrator = () => {
    const [grupe, setGrupe] = useState([]);
    const [selectedGrupa, setSelectedGrupa] = useState('');

    const [cursuri, setCursuri] = useState([]);
    const [selectedCursId, setSelectedCursId] = useState(null);

    const [catalog, setCatalog] = useState([]);
    const [loading, setLoading] = useState(false);

    // Încarcă cursurile la început
    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch('/didactic/course', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                const courseList = data._embedded?.courseList || [];
                setCursuri(courseList);

                if (courseList.length > 0) {
                    setSelectedCursId(courseList[0].id);
                }
            })
            .catch(err => console.error("Eroare la încărcarea cursurilor:", err));
    }, []);

    // Încarcă notele când se selectează un curs sau o grupă
    useEffect(() => {
        if (!selectedCursId) return;

        const token = localStorage.getItem("token");
        setLoading(true);

        fetch(`/didactic/course/${selectedCursId}/grades`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error(`Eroare ${res.status}`);
                return res.json();
            })
            .then(data => {
                const allGroups = [...new Set(data.map(entry => entry.student.facultyGroup))];
                setGrupe(allGroups);

                // Dacă nu e selectată o grupă, o selectăm implicit
                if (!selectedGrupa && allGroups.length > 0) {
                    setSelectedGrupa(allGroups[0]);
                }

                // Filtrare după grupă
                const filtered = data
                    .filter(entry => entry.student.facultyGroup === selectedGrupa)
                    .map(entry => ({
                        name: `${entry.student.firstName} ${entry.student.lastName}`,
                        grade: entry.value
                    }));

                setCatalog(filtered);
                setLoading(false);
            })
            .catch(err => {
                console.error("Eroare la fetch:", err);
                setLoading(false);
            });
    }, [selectedCursId, selectedGrupa]);

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
                        {grupe.map((g, i) => (
                            <option key={i} value={g}>{g}</option>
                        ))}
                    </select>

                    <select value={selectedCursId ?? ''} onChange={e => setSelectedCursId(parseInt(e.target.value))}>
                        {cursuri.map((c) => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="catalog-table">
                <table>
                    <thead>
                    <tr className='titlu'>
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
                                <td>{cursuri.find(c => c.id === selectedCursId)?.title || ''}</td>
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
