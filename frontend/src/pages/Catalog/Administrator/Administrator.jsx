// Administrator.jsx  –  Gauss + Best, totul calculat în browser
import {useEffect, useState} from "react";
import {useNavigate}       from "react-router-dom";
import "./Administrator.css";

export default function Administrator() {
    /* ----------------------- state ------------------------ */
    const [grupe, setGrupe]   = useState([]);
    const [selGr, setSelGr]   = useState("");
    const [cursuri, setCurs]  = useState([]);
    const [idCurs,setIdCurs]  = useState(null);

    const [catalog,setCat]    = useState([]); // [{studentId,name,grade}]
    const [loading,setLoad]   = useState(false);

    const [editIdx,setEditIdx]= useState(null);
    const [editVal,setEditVal]= useState("");

    /** rezultat ultim-scaling aplicat (Gauss sau Best) */
    const [scaledView,   setScaledView]   = useState([]); // pt tabel
    const [scaledGrades, setScaledGrades] = useState([]); // <Grade> pt salvare
    const [lastAlgo,     setLastAlgo]     = useState(null); // "gauss" | "best"

    const token = localStorage.getItem("token");
    const nav   = useNavigate();

    /* ------------------- inițializare cursuri ------------------ */
    useEffect(()=>{
        fetch("/didactic/course",{headers:{Authorization:`Bearer ${token}`}})
            .then(r=>r.json())
            .then(d=>{
                const list = d._embedded?.courseList ?? [];
                setCurs(list);
                if(list.length) setIdCurs(list[0].id);
            });
    },[token]);

    /* ------------------- încărcare catalog -------------------- */
    useEffect(()=>{ if(idCurs) load(idCurs,selGr); },[idCurs,selGr]);

    async function load(cId, grupa) {
        setLoad(true);
        try{
            const [enroll,grades] = await Promise.all([
                fetch(`/didactic/course/${cId}/enrolled`,{headers:{Authorization:`Bearer ${token}`}}).then(r=>r.json()),
                fetch(`/didactic/course/${cId}/grades`,  {headers:{Authorization:`Bearer ${token}`}}).then(r=>r.json())
            ]);
            const groups=[...new Set(enroll.map(e=>e.student.facultyGroup))];
            setGrupe(groups);
            if(!grupa&&groups.length) setSelGr(groups[0]);

            const stud=enroll.filter(e=>e.student.facultyGroup===(grupa||groups[0])).map(e=>e.student);
            setCat(stud.map(s=>({
                studentId:s.id,
                name:`${s.firstName} ${s.lastName}`,
                grade:grades.find(g=>g.student.id===s.id)?.value ?? ""
            })));
            // reset scaled
            setScaledView([]); setScaledGrades([]);
        }finally{ setLoad(false); }
    }

    /* --------------- salvare manuală notă --------------------- */
    async function saveSingle(idx){
        const row=catalog[idx], v=parseFloat(editVal);
        if(isNaN(v)||v<1||v>10) return alert("Nota invalidă!");
        await fetch("/didactic/grade",{
            method: row.grade===""?"POST":"PUT",
            headers: {"Content-Type":"application/json", Authorization:`Bearer ${token}`},
            body: JSON.stringify({id:{idStud:row.studentId,idCourse:idCurs},value:v,gradingDate:new Date().toISOString()})
        });
        setCat(catalog.map((r,i)=>i===idx?{...r,grade:v}:r));
        setEditIdx(null);
    }

    /* ---------------- algoritmi locali ------------------------ */
    function gaussLocal(list){
        const sorted=list.filter(g=>g.value>=4.5).sort((a,b)=>b.value-a.value);
        const n=sorted.length, idx=[0.10,0.25,0.30,0.25];
        const cut=[Math.max(1,Math.round(idx[0]*n))];
        cut.push(cut[0]+Math.max(1,Math.round(idx[1]*n)));
        cut.push(cut[1]+Math.max(1,Math.round(idx[2]*n)));
        cut.push(cut[2]+Math.max(1,Math.round(idx[3]*n)));
        cut.push(n);
        const val=[10,9,8,7,6]; let tier=0,prev=10, out=[];
        sorted.forEach((g,i)=>{
            if(i>=cut[tier]&&g.value!==prev) tier++;
            out.push({...g,value:val[tier]}); prev=g.value;
        });
        list.filter(g=>g.value<4.5).forEach(g=>out.push({...g}));
        return out;
    }
    function bestLocal(list){
        const max=list.filter(g=>g.value>=4.5).reduce((m,g)=>g.value>m?g.value:m,0);
        if(max===0) return list.map(g=>({...g}));
        return list.map(g=>
            g.value>=4.5 ? {...g,value: +(g.value/max*10).toFixed(2)} : {...g}
        );
    }

    /* ------- helper: calculează, afișează, setează state ------- */
    async function runScaling(algo){            // "gauss" | "best"
        if(!idCurs) return;
        try{
            const [gradesR, enrollR] = await Promise.all([
                fetch(`/didactic/course/${idCurs}/grades`,{headers:{Authorization:`Bearer ${token}`}}),
                fetch(`/didactic/course/${idCurs}/enrolled`,{headers:{Authorization:`Bearer ${token}`}})
            ]);
            if(!gradesR.ok) throw new Error(await gradesR.text());
            if(!enrollR.ok) throw new Error(await enrollR.text());

            const all = await gradesR.json();
            const enrolled = await enrollR.json();
            const scaled = algo==="gauss"? gaussLocal(all) : bestLocal(all);

            // Create a map of studentId to student info for quick lookup
            const studentMap = new Map();
            enrolled.forEach(e => {
                studentMap.set(e.student.id, `${e.student.firstName} ${e.student.lastName}`);
            });

            setCat(cur=>cur.map(row=>{
                const f=scaled.find(s=>s.id.idStud===row.studentId);
                return f?{...row,grade:f.value}:row;
            }));
            setScaledGrades(scaled);
            setLastAlgo(algo);
            setScaledView(scaled.map(s=>{
                const name = studentMap.get(s.id.idStud) ?? `Student ${s.id.idStud}`;
                return {studentId:s.id.idStud,name,value:s.value};
            }));
            alert(`Notele ${(algo==="gauss")?"Gauss":"Best"} au fost calculate – apasă "💾 Salvează" pentru a le scrie în catalog.`);
        }catch(e){ console.error(e); alert("Eroare: "+e.message); }
    }

    /* ------------------- salvare scaling ---------------------- */
    async function saveScaling(){
        if(!scaledGrades.length) return;
        try{
            await Promise.all(
                scaledGrades.map(g=>fetch("/didactic/grade",{
                    method:"PUT",
                    headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},
                    body:JSON.stringify({id:g.id,value:g.value,gradingDate:g.gradingDate})
                }))
            );
            alert("Notele au fost salvate!");
            load(idCurs,selGr);
        }catch(e){ console.error(e); alert("Eroare la salvare: "+e.message); }
    }

    /* ------------------------- UI ----------------------------- */
    return (
        <div className="container-catalog">
            {/* selectoare curs/grupă */}
            <div className="catalog-header">
                <h1>CATALOG</h1>
                <div className="select-controls">
                    <select value={selGr} onChange={e=>setSelGr(e.target.value)}>
                        {grupe.map(g=><option key={g}>{g}</option>)}
                    </select>
                    <select value={idCurs||""} onChange={e=>setIdCurs(Number(e.target.value))}>
                        {cursuri.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                </div>
            </div>

            {/* tabel note */}
            <div className="catalog-table">
                <table>
                    <thead><tr><th>Student</th><th>Notă finală</th><th>Acțiuni</th></tr></thead>
                    <tbody>
                    {loading?<tr><td colSpan={3}>Se încarcă…</td></tr>:
                        catalog.map((row,i)=>(
                            <tr key={row.studentId}>
                                <td>{row.name}</td>
                                <td>{editIdx===i
                                    ? <input type="number" min="1" max="10" step="0.01"
                                             value={editVal} onChange={e=>setEditVal(e.target.value)}/>
                                    : row.grade}</td>
                                <td>{editIdx===i
                                    ? <>
                                        <button onClick={()=>saveSingle(i)}>💾</button>
                                        <button onClick={()=>setEditIdx(null)}>↩️</button>
                                    </>
                                    : <>
                                        <button onClick={()=>{setEditIdx(i);setEditVal(row.grade);}}>✏️</button>
                                        <button onClick={()=>nav(`/app/catalog/activity-sheet/${idCurs}/${row.studentId}`)}>📋</button>
                                    </>
                                }</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* butoane acțiune */}
            <div className="catalog-buttons">
                <button onClick={()=>nav(`/app/catalog/activity-sheet/group/${idCurs}?grupa=${encodeURIComponent(selGr)}`)}
                        disabled={!idCurs||!selGr}>
                    🧾 Fișa de activitate — grupă curentă
                </button>

                <button onClick={()=>runScaling("gauss")} disabled={!idCurs}>📊 Aplică Gauss</button>
                <button onClick={()=>runScaling("best")}  disabled={!idCurs}>📈 Aplică Best</button>

                <button onClick={saveScaling} disabled={!scaledGrades.length}>💾 Salvează note</button>
            </div>

            {/* tabel rezultate scaling */}
            {scaledView.length>0 && (
                <div className="catalog-table" style={{marginTop:"2rem"}}>
                    <h2>Note după {lastAlgo==="best" ? "Best" : "Gauss"}</h2>
                    <table><thead><tr><th>Student</th><th>Notă scalată</th></tr></thead>
                        <tbody>
                        {scaledView.map(r=>(
                            <tr key={r.studentId}><td>{r.name}</td><td>{r.value}</td></tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}