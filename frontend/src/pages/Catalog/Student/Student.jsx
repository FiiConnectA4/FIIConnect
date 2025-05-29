import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Student.css';

const StudentCatalog = () => {
    const [searchParams] = useSearchParams();
    const studentId = Number(searchParams.get('studentId')) || 4;   // fallback pt demo

    /* ─────────────── STATE ─────────────── */
    const [semestre, setSemestre]               = useState([]);
    const [selectedSemestru, setSelectedSem]    = useState('');
    const [catalogBySemestru, setCatalogGroup]  = useState({});
    const [catalogCurent, setCatalogCurent]     = useState([]);
    const [punctaj, setPunctaj]                 = useState(0);
    const [media, setMedia]                     = useState(0);
    const [loading, setLoading]                 = useState(true);

    /* ─────────────── HELPERS ─────────────── */
    const token   = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    /* ─────────────── ETAPA 1: cursurile accesibile studentului ─────────────── */
    useEffect(() => {
        (async () => {
            try {
                const res       = await fetch('/didactic/course', { headers });
                const payload   = await res.json();
                const courses   = payload._embedded?.courseList ?? [];

                /* Nu continuăm dacă nu există cursuri. */
                if (!courses.length) {
                    setLoading(false);
                    return;
                }

                /* ─────────────── ETAPA 2: pornim fetch-urile in paralel ─────────────── */
                const detailsPromises = courses.map(async (c) => {
                    /* grades pentru curs */
                    const [gradesRes, detailRes] = await Promise.all([
                        fetch(`/didactic/course/${c.id}/grades`, { headers }),
                        fetch(`/didactic/course/${c.id}`,        { headers })
                    ]);

                    const grades       = await gradesRes.json();
                    const courseDetail = await detailRes.json();

                    /* extrage nota studentului curent, dacă există */
                    const myGradeEntry = grades.find(g => Number(g.student?.id) === studentId);
                    if (!myGradeEntry) return null;

                    const profesor = courseDetail.professors?.[0];
                    return {
                        semestru : `Semestrul ${courseDetail.semester}`,
                        curs     : courseDetail.title,
                        profesor : profesor ? `${profesor.firstName} ${profesor.lastName}` : '-',
                        credite  : courseDetail.credits,
                        nota     : myGradeEntry.value
                    };
                });

                const raw = (await Promise.all(detailsPromises)).filter(Boolean);

                /* ─────────────── ETAPA 3: grupare pe semestre ─────────────── */
                const grouped = raw.reduce((acc, entry) => {
                    acc[entry.semestru] = acc[entry.semestru] ?? [];
                    acc[entry.semestru].push(entry);
                    return acc;
                }, {});

                const semKeys = Object.keys(grouped);
                setSemestre(semKeys);
                setSelectedSem(semKeys[0] || '');
                setCatalogGroup(grouped);
                setLoading(false);
            } catch (err) {
                console.error('⛔ Eroare la fetch-uri catalog student:', err);
                setLoading(false);
            }
        })();
    }, [studentId]);   // dacă schimbăm id din URL, refacem catalogul

    /* ─────────────── ETAPA 4: când se schimbă semestrul ─────────────── */
    useEffect(() => {
        const cursuri = catalogBySemestru[selectedSemestru] || [];
        setCatalogCurent(cursuri);

        const totalPunctaj = cursuri.reduce((s, c) => s + c.credite * c.nota, 0);
        const totalCredite = cursuri.reduce((s, c) => s + c.credite, 0);

        setPunctaj(totalPunctaj);
        setMedia(totalCredite ? (totalPunctaj / totalCredite).toFixed(2) : 0);
    }, [selectedSemestru, catalogBySemestru]);

    /* ─────────────── UI ─────────────── */
    if (loading) return <div className="container-catalog">Se încarcă catalogul…</div>;

    return (
        <div className="container-catalog">
            <div className="catalog-header">
                <h1>CATALOG</h1>

                <div className="select-controls">
                    <select value={selectedSemestru} onChange={e => setSelectedSem(e.target.value)}>
                        {semestre.map((sem) => <option key={sem} value={sem}>{sem}</option>)}
                    </select>
                </div>
            </div>

            <div className="catalog-table">
                <table>
                    <thead>
                    <tr className="titlu">
                        <th>Curs</th>
                        <th>Profesor</th>
                        <th>Credite</th>
                        <th>Notă</th>
                        <th>Fișa&nbsp;Activitate</th>
                    </tr>
                    </thead>
                    <tbody>
                    {catalogCurent.length === 0 && (
                        <tr><td colSpan="5">Nu există note pentru semestrul selectat.</td></tr>
                    )}
                    {catalogCurent.map((c, idx) => (
                        <tr key={idx}>
                            <td>{c.curs}</td>
                            <td>{c.profesor}</td>
                            <td>{c.credite}</td>
                            <td>{c.nota}</td>
                            <td>
                                <button
                                    className="admin-button"
                                    onClick={() => alert(`Deschide fișa pentru ${c.curs}`)}
                                >
                                    <img src="/icons/edit-icon.png" alt="Fișa" className="icon-img" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="catalog-footer">
                <button className="buton-catalog" onClick={() => alert('Download Excel (mock)')}>
                    Descarcă Excel
                </button>

                <div className="stats">
                    <p><strong>Punctaj final:</strong>&nbsp;{punctaj}</p>
                    <p><strong>Media finală:</strong>&nbsp;{media}</p>
                </div>

                <button
                    className="buton-catalog"
                    onClick={() => alert('Cerere mutare grupă trimisă (mock)')}
                >
                    Cerere mutare grupă activitate
                </button>
            </div>
        </div>
    );
};

export default StudentCatalog;
