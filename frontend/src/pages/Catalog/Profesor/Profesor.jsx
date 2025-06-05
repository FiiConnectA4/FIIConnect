// ProfesorScaling.jsx – notație + Gauss + Best, totul local
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profesor.css";

export default function Profesor() {
    const [profesorId, setProfesorId] = useState(null);
    const [cursuri, setCurs] = useState([]);
    const [idCurs, setIdCurs] = useState(null);

    const [grupe, setGrupe] = useState([]);
    const [selGr, setSelGr] = useState("");

    const [catalog, setCatalog] = useState([]);
    const [loading, setLoading] = useState(false);

    const [editingIndex, setEditingIndex] = useState(null);
    const [editedGrade, setEditedGrade] = useState('');

    // Scaling state
    const [scaledView, setScaledView] = useState([]);
    const [scaledGrades, setScaledGrades] = useState([]);
    const [lastAlgo, setLastAlgo] = useState('');

    // Transfer requests state
    const [showTransferPopup, setShowTransferPopup] = useState(false);
    const [transferRequests, setTransferRequests] = useState([]);
    const [loadingTransfers, setLoadingTransfers] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const authHead = { Authorization: `Bearer ${token}` };

    const handleUploadCSV = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('file', file);

            fetch(`/didactic/course/${idCurs}/upload_component_scores_csv`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })
                .then(res => {
                    if (!res.ok) throw new Error('Eroare la încărcarea fișierului CSV');
                    return res.json().catch(() => null);
                })
                .then(() => {
                    alert('Fișierul CSV a fost încărcat cu succes!');
                    // Reload the current course data instead of full page reload
                    load(idCurs, selGr);
                })
                .catch(err => {
                    console.error(err);
                    alert('Eroare la încărcarea fișierului CSV: ' + err.message);
                });
        };
        input.click();
    };

    // Get professor ID
    useEffect(() => {
        fetch("/person/me", { headers: authHead })
            .then(r => r.json())
            .then(d => {
                if (d.role === "ROLE_PROFESOR" && d.professor?.id)
                    setProfesorId(d.professor.id);
            })
            .catch(err => console.error("Eroare la fetch /person/me:", err));
    }, []);

    // Get professor's courses
    useEffect(() => {
        if (!profesorId) return;
        fetch(`/didactic/professor/${profesorId}`, { headers: authHead })
            .then(r => r.json())
            .then(d => {
                const list = (d.courses ?? []).map(c => c.course).filter(c => c.archived !== 1);
                setCurs(list);
                if (list.length) setIdCurs(list[0].id);
            })
            .catch(err => console.error(err));
    }, [profesorId]);

    // Load data when course or group changes
    useEffect(() => {
        if (idCurs) load(idCurs, selGr);
    }, [idCurs, selGr]);

    async function load(cId, grupa) {
        setLoading(true);
        try {
            const [enroll, grades] = await Promise.all([
                fetch(`/didactic/course/${cId}/enrolled`, { headers: authHead }).then(r => r.json()),
                fetch(`/didactic/course/${cId}/grades`, { headers: authHead }).then(r => r.json())
            ]);
            const groups = [...new Set(enroll.map(e => e.student.facultyGroup))];
            setGrupe(groups);
            if (!grupa && groups.length) setSelGr(groups[0]);

            const targetGroup = grupa || groups[0];
            const stud = enroll.filter(e => e.student.facultyGroup === targetGroup).map(e => e.student);
            setCatalog(stud.map(s => ({
                studentId: s.id,
                name: `${s.firstName} ${s.lastName}`,
                grade: grades.find(g => g.student.id === s.id)?.value ?? ""
            })));

            setScaledView([]);
            setScaledGrades([]);
        } finally {
            setLoading(false);
        }
    }

    async function saveSingle(idx) {
        const row = catalog[idx];
        const v = parseFloat(editedGrade);
        if (isNaN(v) || v < 1 || v > 10) return alert("Nota invalidă!");

        try {
            await fetch("/didactic/grade", {
                method: row.grade === "" ? "POST" : "PUT",
                headers: { "Content-Type": "application/json", ...authHead },
                body: JSON.stringify({
                    id: { idStud: row.studentId, idCourse: idCurs },
                    value: v,
                    gradingDate: new Date().toISOString()
                })
            });
            setCatalog(catalog.map((r, i) => i === idx ? { ...r, grade: v } : r));
            setEditingIndex(null);
        } catch (err) {
            console.error('Eroare la salvarea notei:', err);
            alert('Eroare la salvarea notei!');
        }
    }

    function gaussLocal(list) {
        const sorted = list.filter(g => g.value >= 4.5).sort((a, b) => b.value - a.value);
        const n = sorted.length;
        const idx = [0.10, 0.25, 0.30, 0.25];
        const cut = [Math.max(1, Math.round(idx[0] * n))];
        cut.push(cut[0] + Math.max(1, Math.round(idx[1] * n)));
        cut.push(cut[1] + Math.max(1, Math.round(idx[2] * n)));
        cut.push(cut[2] + Math.max(1, Math.round(idx[3] * n)));
        cut.push(n);
        const val = [10, 9, 8, 7, 6];
        let tier = 0, prev = 10, out = [];

        sorted.forEach((g, i) => {
            if (i >= cut[tier] && g.value !== prev) tier++;
            out.push({ ...g, value: val[tier] });
            prev = g.value;
        });
        list.filter(g => g.value < 4.5).forEach(g => out.push({ ...g }));
        return out;
    }

    function bestLocal(list) {
        const max = list.filter(g => g.value >= 4.5).reduce((m, g) => g.value > m ? g.value : m, 0);
        if (max === 0) return list.map(g => ({ ...g }));
        return list.map(g => g.value >= 4.5 ? { ...g, value: +(g.value / max * 10).toFixed(2) } : { ...g });
    }

    async function runScaling(algo) {
        if (!idCurs) return;
        try {
            const [gradesR, enrollR] = await Promise.all([
                fetch(`/didactic/course/${idCurs}/grades`, { headers: authHead }),
                fetch(`/didactic/course/${idCurs}/enrolled`, { headers: authHead })
            ]);
            const all = await gradesR.json();
            const enrolled = await enrollR.json();
            const scaled = algo === "gauss" ? gaussLocal(all) : bestLocal(all);

            const studentMap = new Map();
            enrolled.forEach(e => studentMap.set(e.student.id, `${e.student.firstName} ${e.student.lastName}`));

            setCatalog(cur => cur.map(row => {
                const f = scaled.find(s => s.id.idStud === row.studentId);
                return f ? { ...row, grade: f.value } : row;
            }));
            setScaledGrades(scaled);
            setLastAlgo(algo);
            setScaledView(scaled.map(s => ({
                studentId: s.id.idStud,
                name: studentMap.get(s.id.idStud) ?? `Student ${s.id.idStud}`,
                value: s.value
            })));
            alert(`Notele ${(algo === "gauss") ? "Gauss" : "Best"} au fost calculate.`);
        } catch (e) {
            console.error(e);
            alert("Eroare: " + e.message);
        }
    }

    async function saveScaling() {
        if (!scaledGrades.length) return;
        try {
            await Promise.all(
                scaledGrades.map(g => fetch("/didactic/grade", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", ...authHead },
                    body: JSON.stringify({ id: g.id, value: g.value, gradingDate: g.gradingDate })
                }))
            );
            alert("Notele au fost salvate!");
            load(idCurs, selGr);
        } catch (e) {
            console.error(e);
            alert("Eroare salvare: " + e.message);
        }
    }

    // Transfer requests functions
    const handleShowTransferRequests = () => {
        if (!profesorId) {
            alert('Nu s-a putut obține ID-ul profesorului.');
            return;
        }

        setLoadingTransfers(true);
        setShowTransferPopup(true);

        fetch(`/didactic/transfer/professor/${profesorId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(async (data) => {
                const requests = data || [];

                // Fetch student and course names for each request
                const requestsWithNames = await Promise.all(
                    requests.map(async (request) => {
                        try {
                            const [studentRes, courseRes] = await Promise.all([
                                fetch(`/didactic/student/${request.id.idStud}`, {
                                    headers: { 'Authorization': `Bearer ${token}` }
                                }),
                                fetch(`/didactic/course/${request.id.idCourse}`, {
                                    headers: { 'Authorization': `Bearer ${token}` }
                                })
                            ]);

                            const student = await studentRes.json();
                            const course = await courseRes.json();

                            return {
                                ...request,
                                studentName: `${student.firstName} ${student.lastName}`,
                                courseName: course.title
                            };
                        } catch (err) {
                            console.error('Eroare la încărcarea datelor pentru cererea:', request, err);
                            return {
                                ...request,
                                studentName: `Student ID: ${request.id.idStud}`,
                                courseName: `Curs ID: ${request.id.idCourse}`
                            };
                        }
                    })
                );

                setTransferRequests(requestsWithNames);
                setLoadingTransfers(false);
            })
            .catch(err => {
                console.error('Eroare la încărcarea cererilor de transfer:', err);
                alert('Eroare la încărcarea cererilor de transfer.');
                setLoadingTransfers(false);
            });
    };

    const handleDenyTransfer = (request) => {
        const url = `/didactic/transfer?idStud=${request.id.idStud}&idCourse=${request.id.idCourse}`;

        fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error('Eroare la respingerea cererii');
                // Remove the request from the list
                setTransferRequests(prev => prev.filter(r =>
                    !(r.id.idStud === request.id.idStud && r.id.idCourse === request.id.idCourse)
                ));
                alert('Cererea a fost respinsă cu succes.');
            })
            .catch(err => {
                console.error('Eroare la respingerea cererii:', err);
                alert('Eroare la respingerea cererii: ' + err.message);
            });
    };

    const handleApproveTransfer = (request) => {
        const url = `/didactic/enroll/transfer?studentId=${request.id.idStud}&courseId=${request.id.idCourse}&facultyGroup=${request.facultyGroup}`;

        fetch(url, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) throw new Error('Eroare la aprobarea cererii');
                // Remove the request from the list
                setTransferRequests(prev => prev.filter(r =>
                    !(r.id.idStud === request.id.idStud && r.id.idCourse === request.id.idCourse)
                ));
                alert('Cererea a fost aprobată cu succes.');
            })
            .catch(err => {
                console.error('Eroare la aprobarea cererii:', err);
                alert('Eroare la aprobarea cererii: ' + err.message);
            });
    };

    return (
        <div className="container-catalog">
            <div className="catalog-header">
                <h1>CATALOG</h1>
                <div className="select-controls">
                    <select value={selGr} onChange={e => setSelGr(e.target.value)}>
                        {grupe.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <select value={idCurs || ""} onChange={e => setIdCurs(Number(e.target.value))}>
                        {cursuri.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                </div>
            </div>

            <div className="catalog-table">
                <table>
                    <thead>
                    <tr>
                        <th>Student</th>
                        <th>Notă</th>
                        <th>Acțiuni</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr><td colSpan={3}>Se încarcă...</td></tr>
                    ) : (
                        catalog.map((row, i) => (
                            <tr key={row.studentId}>
                                <td>{row.name}</td>
                                <td>
                                    {editingIndex === i ? (
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            step="0.01"
                                            value={editedGrade}
                                            onChange={e => setEditedGrade(e.target.value)}
                                        />
                                    ) : row.grade}
                                </td>
                                <td>
                                    {editingIndex === i ? (
                                        <>
                                            <button onClick={() => saveSingle(i)}>💾</button>
                                            <button onClick={() => setEditingIndex(null)}>↩️</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => {
                                                setEditingIndex(i);
                                                setEditedGrade(row.grade);
                                            }}>✏️</button>
                                            <button onClick={() => navigate(`/app/catalog/activity-sheet/${idCurs}/${row.studentId}`)}>📋</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            <div className="catalog-buttons">
                <button
                    onClick={() => navigate(`/app/catalog/activity-sheet/group/${idCurs}?grupa=${encodeURIComponent(selGr)}`)}
                    disabled={!idCurs || !selGr}
                >
                    🧾 Fișa grupă
                </button>
                <button onClick={() => runScaling("gauss")}>📊 Aplică Gauss</button>
                <button onClick={() => runScaling("best")}>📈 Aplică Best</button>
                <button onClick={saveScaling} disabled={!scaledGrades.length}>💾 Salvează note</button>
                <button onClick={handleUploadCSV} disabled={!idCurs}>📤 Încarcă CSV</button>
                <button onClick={handleShowTransferRequests}>Vezi cereri de transfer la cursul tau</button>
            </div>

            {scaledView.length > 0 && (
                <div className="catalog-table" style={{ marginTop: "2rem" }}>
                    <h2>Note după {lastAlgo === "best" ? "Best" : "Gauss"}</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>Student</th>
                            <th>Notă scalată</th>
                        </tr>
                        </thead>
                        <tbody>
                        {scaledView.map(r => (
                            <tr key={r.studentId}>
                                <td>{r.name}</td>
                                <td>{r.value}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Transfer Requests Popup */}
            {showTransferPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <div className="popup-header">
                            <h2>Cereri de transfer</h2>
                            <button
                                className="popup-close"
                                onClick={() => setShowTransferPopup(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="popup-body">
                            {loadingTransfers ? (
                                <div className="loading-text">Se încarcă cererile...</div>
                            ) : transferRequests.length === 0 ? (
                                <div className="no-requests">Nu există cereri de transfer.</div>
                            ) : (
                                <div className="transfer-requests-list">
                                    {transferRequests.map((request, index) => (
                                        <div key={index} className="transfer-request-item">
                                            <div className="request-info">
                                                <div className="request-details">
                                                    <strong>Student:</strong> {request.studentName} |
                                                    <strong> Curs:</strong> {request.courseName} |
                                                    <strong> Grupa:</strong> {request.facultyGroup}
                                                </div>
                                                <div className="request-reason">
                                                    <strong>Motiv:</strong> {request.reasonText}
                                                </div>
                                            </div>
                                            <div className="request-actions">
                                                <button
                                                    className="approve-btn"
                                                    onClick={() => handleApproveTransfer(request)}
                                                >
                                                    Aprobă
                                                </button>
                                                <button
                                                    className="deny-btn"
                                                    onClick={() => handleDenyTransfer(request)}
                                                >
                                                    Respinge
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}