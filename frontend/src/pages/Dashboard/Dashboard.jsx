import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
    // State-uri pentru date reale
    const [username, setUsername] = useState("utilizator");
    const [nrAnunturi, setNrAnunturi] = useState("-");
    const [nrCursuri, setNrCursuri] = useState("-");
    const [ultimaNota, setUltimaNota] = useState("-");
    const [orarAzi, setOrarAzi] = useState({ ora: "-", disciplina: "-" });
    // Pentru id student, an, grupă
    const [studentId, setStudentId] = useState(null);
    const [an, setAn] = useState("");
    const [grupa, setGrupa] = useState("");

    const navigate = useNavigate();

    // Fetch profile + anunțuri + cursuri
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch("/profile", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                let nume = "";
                if (data.firstName) nume += data.firstName + " ";
                if (data.lastName) nume += data.lastName;
                setUsername(nume.trim() || data.username || "utilizator");
                setStudentId(data.studentId || data.id || null); // adaptează dacă e altă cheie!
                setAn(data.year || data.an || "");
                setGrupa(data.group || data.grupa || "");
            })
            .catch(() => setUsername("utilizator"));

        // Număr anunțuri
        fetch("/announcement", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setNrAnunturi(Array.isArray(data) ? data.length : "-"))
            .catch(() => setNrAnunturi("-"));

        // Număr cursuri (Spring HATEOAS sau array simplu)
        fetch("/didactic/course", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                let lista = [];
                if (data._embedded && data._embedded.courseList) {
                    lista = data._embedded.courseList;
                } else if (Array.isArray(data)) {
                    lista = data;
                }
                setNrCursuri(lista.length);
            })
            .catch(() => setNrCursuri("-"));
    }, []);

    // Fetch pentru ultima notă (după ce ai studentId)
    useEffect(() => {
        if (!studentId) return;
        const token = localStorage.getItem("token");
        fetch(`/didactic/student/${studentId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                const grades = data.grades || [];
                let nota = "-";
                if (grades.length > 0) {
                    // Dacă ai gradingDate, poți sorta, altfel iei ultimul
                    // grades.sort((a, b) => new Date(b.gradingDate) - new Date(a.gradingDate));
                    // nota = grades[0].value;
                    nota = grades[grades.length - 1].value;
                }
                setUltimaNota(nota);
            })
            .catch(() => setUltimaNota("-"));
    }, [studentId]);

    // Fetch pentru orarul de azi (după ce ai an și grupă)
    useEffect(() => {
        if (!an || !grupa) return;
        const token = localStorage.getItem("token");
        // Numele zilei curente (backend-ul folosește "Luni", "Marți" etc.)
        const zileSapt = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];
        const ziAstazi = zileSapt[new Date().getDay()];

        fetch(`/orar/studenti/${an}/${grupa}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const orarAziObj = data.find(item => item.zi === ziAstazi);
                    if (orarAziObj) {
                        setOrarAzi({
                            ora: orarAziObj.ora || "-",
                            disciplina: orarAziObj.disciplina || "-"
                        });
                    } else {
                        setOrarAzi({ ora: "-", disciplina: "-" });
                    }
                } else {
                    setOrarAzi({ ora: "-", disciplina: "-" });
                }
            })
            .catch(() => setOrarAzi({ ora: "-", disciplina: "-" }));
    }, [an, grupa]);

    return (
        <div className="dashboard-content">
            <div className="dashboard-title">Salut, {username}!</div>
            <div className="dashboard-cards-row">
                <div
                    className="dashboard-card"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/app/anunturi")}
                    title="Vezi anunțurile"
                >
                    <span className="icon purple">💬</span>
                    <span className="card-title">Anunțuri noi</span>
                    <span className="card-value">{nrAnunturi}</span>
                </div>
                <div
                    className="dashboard-card"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/app/cursuri")}
                    title="Vezi cursurile"
                >
                    <span className="icon blue">📚</span>
                    <span className="card-title">Cursuri active</span>
                    <span className="card-value">{nrCursuri}</span>
                </div>
                <div
                    className="dashboard-card"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/app/catalog")}
                    title="Vezi catalogul"
                >
                    <span className="icon yellow">⭐</span>
                    <span className="card-title">Ultima notă</span>
                    <span className="card-value">{ultimaNota}</span>
                </div>
                <div
                    className="dashboard-card"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/app/orar")}
                    title="Vezi orarul"
                >
                    <span className="icon pink">📅</span>
                    <span className="card-title">Orar azi</span>
                    <span className="card-value card-orar">
                        <span className="ora">{orarAzi.ora}</span>
                        <span className="disciplina" style={{ marginLeft: 8 }}>
                            {orarAzi.disciplina}
                        </span>
                    </span>
                </div>
            </div>

            <div className="dashboard-bottom-row">
                {/* Calendar */}
                <div className="glass-card dashboard-calendar">
                    <div className="calendar-title">Mai 2025</div>
                    <div className="calendar-table">
                        <div className="calendar-days">
                            <span>Du</span>
                            <span>Lu</span>
                            <span>Ma</span>
                            <span>Mi</span>
                            <span>Jo</span>
                            <span>Vi</span>
                            <span>Sâ</span>
                        </div>
                        <div className="calendar-dates">
                            {[...Array(31)].map((_, i) => (
                                <span
                                    key={i}
                                    className={i === new Date().getDate() - 1 ? "calendar-today" : ""}
                                >
                                    {i + 1}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Ultimele activități */}
                <div className="glass-card dashboard-activities">
                    <div className="activities-title">Ultimele activități</div>
                    <ul>
                        <li>
                            Andrei, unde s... <span className="time">Acum 2 ore</span>
                        </li>
                        <li>
                            Notă adăugată... <span className="time">Ieri</span>
                        </li>
                        <li>
                            Mesaj nou de l... <span className="time">Ieri</span>
                        </li>
                        <li>
                            Atestat la pro... <span className="time">12 Apr.</span>
                        </li>
                    </ul>
                </div>

                {/* News Feed */}
                <div className="glass-card dashboard-news">
                    <div className="news-title">News Feed</div>
                    <ul>
                        <li>
                            <span className="news-dot green"></span>Profesorii au adăugat teme noi!
                        </li>
                        <li>
                            <span className="news-dot red"></span>Atenție: Seminarul de baze de date sâmbătă.
                        </li>
                        <li>
                            <span className="news-dot purple"></span>S-a format un nou grup de studiu.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
