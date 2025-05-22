// src/pages/Dashboard/Dashboard.jsx
import { useNavigate } from "react-router-dom";
import InfoCard from '../../components/DashboardWidgets/InfoCard';
import ActivitiesList from '../../components/DashboardWidgets/ActivitiesList';
import CalendarCard from '../../components/DashboardWidgets/CalendarCard';
import './Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();

    const stats = {
        announcements: 3,
        courses: 5,
        lastGrade: 8.5,
        todaySchedule: "9:00 Algoritmi fundamentali"
    };

    const activities = [
        { title: "Andrei, unde se detali...", time: "Acum 2 ore" },
        { title: "Notă adăugată la Proiect...", time: "Ieri" },
        { title: "Mesaj nou de la Radu L.", time: "Ieri" },
        { title: "Atestat la programare.", time: "12 Apr." }
    ];

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Salut, Andrei!</h1>
            <div className="dashboard-row">
                <div style={{ cursor: "pointer" }} onClick={() => navigate("/app/anunturi")}>
                    <InfoCard icon="💬" title="Anunțuri noi" value={stats.announcements} />
                </div>
                <div style={{ cursor: "pointer" }} onClick={() => navigate("/app/cursuri")}>
                    <InfoCard icon="📚" title="Cursuri active" value={stats.courses} />
                </div>
                <div style={{ cursor: "pointer" }} onClick={() => navigate("/app/catalog")}>
                    <InfoCard icon="⭐" title="Ultima notă" value={stats.lastGrade} />
                </div>
                <div style={{ cursor: "pointer" }} onClick={() => navigate("/app/orar")}>
                    <InfoCard icon="📅" title="Orar azi" value={stats.todaySchedule} />
                </div>
            </div>
            <div className="dashboard-row">
                <CalendarCard />
                <ActivitiesList activities={activities} />
            </div>
        </div>
    );
}
export default Dashboard;
