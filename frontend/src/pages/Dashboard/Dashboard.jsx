import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // Ensure your CSS is correctly linked

function Dashboard() {
    // State-uri pentru date reale
    const [username, setUsername] = useState("utilizator");
    const [nrAnunturi, setNrAnunturi] = useState("-");
    const [nrCursuri, setNrCursuri] = useState("-");
    const [productiveHoursData, setProductiveHoursData] = useState([]); // State for productive hours data
    // Initialize orarAzi with a mocked value
    const [orarAzi, setOrarAzi] = useState({ ora: "8:00-10:00", disciplina: "Retele de Calculatoare" }); //
    // Pentru id student, an, grupă
    const [studentId, setStudentId] = useState(null);
    const [an, setAn] = useState("");
    const [grupa, setGrupa] = useState("");

    const navigate = useNavigate();

    // Fetch user profile (including studentId, an, grupa), announcements, and courses
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/"); // Redirect if no token
            return;
        }

        // Fetch user info from /person/me
        fetch("/person/me", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) {
                    // Handle non-2xx responses, e.g., 401, 404, 403
                    if (res.status === 401 || res.status === 403) {
                        console.error("Authentication error for /person/me:", res.status);
                        navigate("/"); // Redirect to login if unauthorized
                    } else if (res.status === 404) {
                        console.error("User not found for /person/me.");
                        navigate("/app/setup-profile");
                    }
                    throw new Error(`Failed to fetch user info: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                // data is a PersonInfoDTO
                let fetchedUsername = "utilizator";
                if (data.username) {
                    fetchedUsername = data.username;
                }
                if (data.student && data.student.firstName && data.student.lastName) { //
                    fetchedUsername = `${data.student.firstName} ${data.student.lastName}`; //
                } else if (data.professor && data.professor.firstName && data.professor.lastName) { //
                    fetchedUsername = `${data.professor.firstName} ${data.professor.lastName}`; //
                }
                setUsername(fetchedUsername.trim()); // Set fetched username

                // Extract student specific info
                if (data.student) { //
                    setStudentId(data.student.id); //
                    setAn(data.student.year || ""); //
                    setGrupa(data.student.facultyGroup || ""); //
                } else {
                    setStudentId(null);
                    setAn("");
                    setGrupa("");
                }
            })
            .catch((error) => {
                console.error("Error fetching user profile:", error);
                setUsername("utilizator"); // Fallback
                setStudentId(null);
                setAn("");
                setGrupa("");
            });

        // Număr anunțuri
        fetch("/announcement", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setNrAnunturi(Array.isArray(data) ? data.length : "-"))
            .catch((error) => {
                console.error("Error fetching announcements:", error);
                setNrAnunturi("-");
            });

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
            .catch((error) => {
                console.error("Error fetching courses:", error);
                setNrCursuri("-");
            });
    }, [navigate]);

    // NEW useEffect for Productive Hours
    useEffect(() => {
        if (!studentId) return; // Only fetch if studentId is available
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch(`/didactic/statistics/productiveHours/${studentId}`, { //
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                setProductiveHoursData(data); //
            })
            .catch((error) => {
                console.error("Error fetching productive hours:", error);
                setProductiveHoursData([]); // Set to empty array on error
            });
    }, [studentId]); // Depend on studentId to re-fetch when it's set

    // REMOVED: Fetch for today's schedule. Now using a mocked value.
    /*
    useEffect(() => {
        if (!an || !grupa) return;
        const token = localStorage.getItem("token");
        const zileSapt = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];
        const ziAstazi = zileSapt[new Date().getDay()];

        fetch(`/orar/studenti/<span class="math-inline">\{an\}/</span>{grupa}`, {
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
            .catch((error) => {
                console.error("Error fetching schedule:", error);
                setOrarAzi({ ora: "-", disciplina: "-" });
            });
    }, [an, grupa]);
    */

    // Helper function to find the most productive interval
    const getMostProductiveInterval = () => {
        if (!productiveHoursData || productiveHoursData.length === 0) {
            return { interval: "N/A", average: "-" };
        }

        // Filter out intervals with 0 grades (no data for that interval), then find the one with the highest average
        const intervalsWithGrades = productiveHoursData.filter(item => item.count > 0);

        if (intervalsWithGrades.length === 0) {
            return { interval: "N/A", average: "N/A" };
        }

        const mostProductive = intervalsWithGrades.reduce((prev, current) => {
            return (prev.average > current.average) ? prev : current;
        });

        return {
            interval: mostProductive.interval,
            average: mostProductive.average.toFixed(1) // Format to one decimal place
        };
    };

    const mostProductive = getMostProductiveInterval();

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
                {/* REPLACED: Ultima notă card with Productive Hours card */}
                <div
                    className="dashboard-card"
                    style={{ cursor: "pointer" }}
                    onClick={() => { /* Potentially navigate to a statistics page */ }}
                    title="Vezi orele productive"
                >
                    <span className="icon yellow">⏳</span> {/* Changed icon to a clock/hourglass */}
                    <span className="card-title">Ore Productive</span>
                    <span className="card-value card-productive-hours">
                        <span className="interval">{mostProductive.interval}</span>
                        {mostProductive.average !== "N/A" && (
                            <span className="average" style={{ marginLeft: 8 }}>
                                ({mostProductive.average} avg)
                            </span>
                        )}
                    </span>
                </div>
                <div
                    className="dashboard-card"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/app/orar")}
                    title="Vezi orarul"
                >
                    <span className="icon pink">📅</span>
                    <span className="card-title">Urmatoarea Ora</span>
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