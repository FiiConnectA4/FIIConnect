// src/pages/Dashboard/Dashboard.jsx
import InfoCard from '../../components/DashboardWidgets/InfoCard';
import ActivitiesList from '../../components/DashboardWidgets/ActivitiesList';
import CalendarCard from '../../components/DashboardWidgets/CalendarCard';
import './Dashboard.css'; // Importă stilurile noi

function Dashboard() {
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
                <InfoCard icon="💬" title="Anunțuri noi" value={stats.announcements} />
                <InfoCard icon="📚" title="Cursuri active" value={stats.courses} />
                <InfoCard icon="⭐" title="Ultima notă" value={stats.lastGrade} />
                <InfoCard icon="📅" title="Orar azi" value={stats.todaySchedule} />
            </div>
            <div className="dashboard-row">
                <CalendarCard />
                <ActivitiesList activities={activities} />
            </div>
        </div>
    );
}
export default Dashboard;
