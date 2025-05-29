import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Student.css';

const StudentCatalog = () => {
    const [searchParams] = useSearchParams();
    const studentId = Number(searchParams.get('studentId')) || 5;

    /* -------------------------- STATE -------------------------- */
    const [semestre, setSemestre]           = useState([]);
    const [selectedSem, setSelectedSem]     = useState('');
    const [bySem, setBySem]                 = useState({});
    const [curCatalog, setCurCatalog]       = useState([]);
    const [points, setPoints]               = useState(0);
    const [avg, setAvg]                     = useState(0);
    const [loading, setLoading]             = useState(true);

    /* ------------------------ HELPERS -------------------------- */
    const token   = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    /* 1️⃣  — cursurile la care poate accesa studentul ------------ */
    useEffect(() => {
        (async () => {
            try {
                const res     = await fetch('/didactic/course', { headers });
                const body    = await res.json();
                const courses = body._embedded?.courseList ?? [];

                if (!courses.length) { setLoading(false); return; }

                /* 2️⃣  — grades + detalii în paralel pentru fiecare curs */
                const detailPromises = courses.map(async c => {
                    const [gradesRes, detailRes] = await Promise.all([
                        fetch(`/didactic/course/${c.id}/grades`, { headers }),
                        fetch(`/didactic/course/${c.id}`,        { headers })
                    ]);

                    const grades = await gradesRes.json();
                    const det    = await detailRes.json();

                    /* note doar pentru studentul curent */
                    const myGrade = grades.find(g => Number(g.student?.id) === studentId);
                    if (!myGrade) return null;

                    /* profesorul este Teaching → professor */
                    const teaching   = det.professors?.[0];            // primul element din array
                    const profObj    = teaching?.professor;            // obiect Professor
                    const profName   = profObj
                        ? `${profObj.firstName} ${profObj.lastName}`
                        : '—';

                    return {
                        semestru : `Semestrul ${det.semester}`,
                        curs     : det.title,
                        profesor : profName,
                        credite  : det.credits,
                        nota     : myGrade.value
                    };
                });

                const raw = (await Promise.all(detailPromises)).filter(Boolean);

                /* 3️⃣  — grupare pe semestre */
                const grouped = raw.reduce((acc, row) => {
                    (acc[row.semestru] = acc[row.semestru] || []).push(row);
                    return acc;
                }, {});
                const semKeys = Object.keys(grouped);

                setSemestre(semKeys);
                setSelectedSem(semKeys[0] || '');
                setBySem(grouped);
                setLoading(false);
            } catch (err) {
                console.error('⛔  Eroare catalog student:', err);
                setLoading(false);
            }
        })();
    }, [studentId]);

    /* 4️⃣  — când schimb semestrul recalculez punctaj & medie */
    useEffect(() => {
        const cursuri = bySem[selectedSem] || [];
        setCurCatalog(cursuri);

        const p  = cursuri.reduce((s, c) => s + c.credite * c.nota, 0);
        const cr = cursuri.reduce((s, c) => s + c.credite, 0);
        setPoints(p);
        setAvg(cr ? (p / cr).toFixed(2) : 0);
    }, [selectedSem, bySem]);

    /* --------------------------- UI --------------------------- */
    if (loading) return <div className="container-catalog">Se încarcă catalogul…</div>;

    return (
        <div className="container-catalog">
            <div className="catalog-header">
                <h1>CATALOG</h1>

                {/*  păstrăm containerul pentru styling  */}
                <div className="select-controls">
                    <select
                        value={selectedSem}
                        onChange={e => setSelectedSem(e.target.value)}
                    >
                        {semestre.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="catalog-table">
                <table>
                    <thead>
                    <tr className="titlu">
                        <th>Curs</th><th>Profesor</th><th>Credite</th><th>Notă</th><th>Fișa</th>
                    </tr>
                    </thead>
                    <tbody>
                    {curCatalog.length === 0 && (
                        <tr><td colSpan="5">Nu există note pentru semestrul selectat.</td></tr>
                    )}
                    {curCatalog.map((c, i) => (
                        <tr key={i}>
                            <td>{c.curs}</td>
                            <td>{c.profesor}</td>
                            <td>{c.credite}</td>
                            <td>{c.nota}</td>
                            <td>
                                <button onClick={() => alert(`Fișa activitate: ${c.curs}`)}>
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
                    <p><strong>Punctaj final:</strong> {points}</p>
                    <p><strong>Media finală:</strong> {avg}</p>
                </div>
            </div>
        </div>
    );
};

export default StudentCatalog;
