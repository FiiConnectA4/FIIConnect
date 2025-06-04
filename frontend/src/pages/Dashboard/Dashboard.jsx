import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import pentru redirect
import "./Dashboard.css";

function Dashboard() {
    // 1. State pentru numele userului
    const [username, setUsername] = useState("utilizator");

    // 2. Hook pentru redirect
    const navigate = useNavigate();

    // 3. Preia numele real din localStorage și din backend la mount
    useEffect(() => {
        // Preia obiectul user din localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const userObj = JSON.parse(storedUser);
                if (userObj.username) {
                    setUsername(userObj.username);
                }
            } catch (err) {
                console.error("Eroare la parsarea user din localStorage:", err);
            }
        }

        // Ia tokenul JWT din localStorage (adaptează dacă îl salvezi altfel!)
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
                const realName = nume.trim() || data.username;
                if (realName) setUsername(realName);
            })
            .catch(() => {});
    }, []);

    return (
        <div className="dashboard-content">
            {/* Afișează numele real */}
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
                    <span className="card-value">3</span>
                </div>
                <div
                    className="dashboard-card"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/app/cursuri")}
                    title="Vezi cursurile"
                >
                    <span className="icon blue">📚</span>
                    <span className="card-title">Cursuri active</span>
                    <span className="card-value">5</span>
                </div>
                <div
                    className="dashboard-card"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/app/catalog")}
                    title="Vezi catalogul"
                >
                    <span className="icon yellow">⭐</span>
                    <span className="card-title">Ultima notă</span>
                    <span className="card-value">8.5</span>
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
                        <span className="ora">9:00</span>
                        <span className="disciplina" style={{ marginLeft: 8 }}>
                            Algoritmi fundamentali
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