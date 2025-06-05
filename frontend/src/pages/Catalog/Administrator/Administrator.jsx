// Administrator.jsx – variantă fără GET-cu-body
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import "./Administrator.css";

export default function Administrator() {
    /* ---------- state ---------- */
    const [grupe,        setGrupe]        = useState([]);
    const [selectedGr,   setSelectedGr]   = useState("");
    const [cursuri,      setCursuri]      = useState([]);
    const [idCurs,       setIdCurs]       = useState(null);

    const [catalog,      setCatalog]      = useState([]);   // [{studentId,name,grade}]
    const [loading,      setLoading]      = useState(false);

    const [editIdx,      setEditIdx]      = useState(null);
    const [editVal,      setEditVal]      = useState("");

    const [gaussView,    setGaussView]    = useState([]);   // rezultate simulate pt UI
    const [gaussPayload, setGaussPayload] = useState([]);   // array <Grade> pt salvare

    const token    = localStorage.getItem("token");
    const navigate = useNavigate();

    /* ---------- inițializare cursuri ---------- */
    useEffect(() => {
        fetch("/didactic/course", {headers:{Authorization:`Bearer ${token}`}})
            .then(r => r.json())
            .then(d => {
                const list = d._embedded?.courseList ?? [];
                setCursuri(list);
                if (list.length) setIdCurs(list[0].id);
            });
    }, [token]);

    /* ---------- încărcare catalog ---------- */
    useEffect(() => { if (idCurs) loadCatalog(idCurs, selectedGr); }, [idCurs, selectedGr]);

    async function loadCatalog(idCourse, grupaSel) {
        setLoading(true);
        try {
            const [enrolled, grades] = await Promise.all([
                fetch(`/didactic/course/${idCourse}/enrolled`, {headers:{Authorization:`Bearer ${token}`}}).then(r=>r.json()),
                fetch(`/didactic/course/${idCourse}/grades`,   {headers:{Authorization:`Bearer ${token}`}}).then(r=>r.json())
            ]);

            const groups = [...new Set(enrolled.map(e => e.student.facultyGroup))];
            setGrupe(groups);
            if (!grupaSel && groups.length) setSelectedGr(groups[0]);

            const students = enrolled
                .filter(e => e.student.facultyGroup === (grupaSel || groups[0]))
                .map(e => e.student);

            setCatalog(students.map(st => ({
                studentId : st.id,
                name      : `${st.firstName} ${st.lastName}`,
                grade     : grades.find(g => g.student.id === st.id)?.value ?? ""
            })));
            /* resetăm eventualele calcule Gauss anterioare */
            setGaussView([]);
            setGaussPayload([]);
        } finally {
            setLoading(false);
        }
    }

    /* ---------- salvare manuală pentru o singură notă ---------- */
    async function saveSingle(idx) {
        const row  = catalog[idx];
        const val  = parseFloat(editVal);
        if (isNaN(val) || val < 1 || val > 10) return alert("Nota invalidă.");

        await fetch("/didactic/grade", {
            method : row.grade === "" ? "POST" : "PUT",
            headers: {"Content-Type":"application/json", Authorization:`Bearer ${token}`},
            body   : JSON.stringify({
                id          : {idStud:row.studentId, idCourse:idCurs},
                value       : val,
                gradingDate : new Date().toISOString()
            })
        });
        setCatalog(catalog.map((r,i)=> i===idx ? {...r,grade:val} : r));
        setEditIdx(null);
    }

    /* ---------- algoritmul Gauss (copiat din backend) ---------- */
    function gaussLocal(gradesArr) {
        const copy = gradesArr.filter(g => g.value >= 4.5)
            .sort((a,b)=>b.value-a.value);  // desc

        const n = copy.length;
        const idx10 = Math.max(1, Math.round(0.10*n));
        const idx9  = idx10 + Math.max(1, Math.round(0.25*n));
        const idx8  = idx9  + Math.max(1, Math.round(0.30*n));
        const idx7  = idx8  + Math.max(1, Math.round(0.25*n));
        const idx6  = n;

        const thresholds = [idx10, idx9, idx8, idx7, idx6];
        const values     = [10, 9, 8, 7, 6];

        let tier = 0, prev = 10;
        const scaled = [];

        for (let i=0; i<copy.length; ++i) {
            const g = copy[i];
            if (i>=thresholds[tier] && g.value!==prev) tier++;
            scaled.push({...g, value:values[tier]});
            prev = g.value;
        }
        // note <4.5 rămân la fel
        gradesArr.filter(g=>g.value<4.5).forEach(g=>scaled.push({...g}));

        return scaled;
    }

    /* ---------- “Aplică Gauss” ---------- */
    async function handleGauss() {
        if (!idCurs) return;

        try {
            const res = await fetch(`/didactic/course/${idCurs}/grades`, {
                headers:{Authorization:`Bearer ${token}`}
            });
            if (!res.ok) throw new Error(await res.text());
            const all = await res.json();          // listă Grade DTO (id, value, ...)

            const scaled = gaussLocal(all);        // <-- local, fără backend

            // actualizăm tabelul doar vizual
            setCatalog(cur =>
                cur.map(r => {
                    const f = scaled.find(s => s.id.idStud === r.studentId);
                    return f ? {...r, grade:f.value} : r;
                })
            );
            setGaussPayload(scaled);               // pt salvare
            setGaussView(
                scaled.map(s => ({
                    studentId : s.id.idStud,
                    name      : catalog.find(c=>c.studentId===s.id.idStud)?.name ?? `Student ${s.id.idStud}`,
                    value     : s.value
                }))
            );
            alert("Notele scalate au fost calculate. Dacă ești mulțumit, apasă “💾 Salvează note Gauss”.");
        } catch(e) {
            console.error(e);
            alert("Eroare la calculul Gauss: "+e.message);
        }
    }

    /* ---------- “Salvează note Gauss” ---------- */
    async function saveGauss() {
        if (!gaussPayload.length) return;

        try {
            await Promise.all(
                gaussPayload.map(g =>
                    fetch("/didactic/grade", {
                        method : "PUT",                   // presupunem existența notei; schimbă în "POST" pt absență
                        headers: {"Content-Type":"application/json", Authorization:`Bearer ${token}`},
                        body   : JSON.stringify({
                            id          : g.id,
                            value       : g.value,
                            gradingDate : g.gradingDate
                        })
                    })
                )
            );
            alert("Notele scalate au fost salvate!");
            // re-împrospătăm catalogul din server ca să fim siguri
            loadCatalog(idCurs, selectedGr);
        } catch(e) {
            console.error(e);
            alert("Eroare la salvarea notelor: "+e.message);
        }
    }

    /* ---------- UI ---------- */
    return (
        <div className="container-catalog">
            <div className="catalog-header">
                <h1>CATALOG</h1>
                <div className="select-controls">
                    <select value={selectedGr} onChange={e=>setSelectedGr(e.target.value)}>
                        {grupe.map(g=><option key={g}>{g}</option>)}
                    </select>
                    <select value={idCurs||""} onChange={e=>setIdCurs(Number(e.target.value))}>
                        {cursuri.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                </div>
            </div>

            <div className="catalog-table">
                <table>
                    <thead><tr><th>Student</th><th>Notă finală</th><th>Acțiuni</th></tr></thead>
                    <tbody>
                    {loading ? (
                        <tr><td colSpan={3}>Se încarcă…</td></tr>
                    ) : (
                        catalog.map((row,idx)=>(
                            <tr key={row.studentId}>
                                <td>{row.name}</td>
                                <td>
                                    {editIdx===idx
                                        ? <input
                                            type="number" min="1" max="10" step="0.01"
                                            value={editVal} onChange={e=>setEditVal(e.target.value)}
                                        />
                                        : row.grade}
                                </td>
                                <td>
                                    {editIdx===idx ? (
                                        <>
                                            <button onClick={()=>saveSingle(idx)}>💾</button>
                                            <button onClick={()=>setEditIdx(null)}>↩️</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={()=>{setEditIdx(idx);setEditVal(row.grade);}}>✏️</button>
                                            <button onClick={()=>navigate(`/app/catalog/activity-sheet/${idCurs}/${row.studentId}`)}>📋</button>
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
                    onClick={()=>navigate(`/app/catalog/activity-sheet/group/${idCurs}?grupa=${encodeURIComponent(selectedGr)}`)}
                    disabled={!idCurs || !selectedGr}
                >🧾 Fișa de activitate — grupă curentă</button>

                <button onClick={handleGauss} disabled={!idCurs}>📊 Aplică Gauss</button>

                <button onClick={saveGauss} disabled={!gaussPayload.length}>💾 Salvează note Gauss</button>
            </div>

            {gaussView.length>0 && (
                <div className="catalog-table" style={{marginTop:"2rem"}}>
                    <h2>Note după Gauss (simulate)</h2>
                    <table><thead><tr><th>Student</th><th>Notă scalată</th></tr></thead>
                        <tbody>
                        {gaussView.map(r=>(
                            <tr key={r.studentId}><td>{r.name}</td><td>{r.value}</td></tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}