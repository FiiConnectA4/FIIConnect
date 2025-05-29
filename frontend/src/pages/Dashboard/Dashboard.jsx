// src/pages/Dashboard/Dashboard.jsx
import { useNavigate } from "react-router-dom";
import InfoCard from '../../components/DashboardWidgets/InfoCard';
import ActivitiesList from '../../components/DashboardWidgets/ActivitiesList';
import CalendarCard from '../../components/DashboardWidgets/CalendarCard';
import NewsFeed from '../../components/DashboardWidgets/NewsFeed';  // <— nou
import './Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
// Adaugă la începutul funcției Dashboard:
const user = JSON.parse(localStorage.getItem("user"));
const username = user?.username || "utilizator";




    const stats = [
        { icon: '💬', title: 'Anunțuri noi',     value: 3,               to: '/app/anunturi' },
        { icon: '📚', title: 'Cursuri active',   value: 5,               to: '/app/cursuri'   },
        { icon: '⭐', title: 'Ultima notă',      value: 8.5,             to: '/app/catalog'   },
        { icon: '📅', title: 'Orar azi',         value: '9:00 Algoritmi fundamentali', to: '/app/orar' }
    ];

    const activities = [
        { title: "Andrei, unde se detali...", time: "Acum 2 ore" },
        { title: "Notă adăugată la Proiect...", time: "Ieri" },
        { title: "Mesaj nou de la Radu L.",     time: "Ieri" },
        { title: "Atestat la programare.",      time: "12 Apr." }
    ];

    // date dummy pentru NewsFeed
    const newsItems = [
        { id: 1, text: "👨‍🏫 Profesorii au adăugat teme noi!" },
        { id: 2, text: "📢 Atenție: Seminarul de baze de date sâmbătă." },
        { id: 3, text: "🎉 S-a format un nou grup de studiu." }
    ];

    return (
        <div className="dashboard-container">
             <h1 className="dashboard-title">Salut, {username}!</h1>



            <div className="dashboard-stats">
                {stats.map((c, i) => (
                    <div key={i} className="stat-card" onClick={() => navigate(c.to)}>
                        <InfoCard icon={c.icon} title={c.title} value={c.value} />
                    </div>
                ))}
            </div>

            {/* === aici am modificat === */}
            <div className="dashboard-widgets">
                <div className="dashboard-widgets-left">
                    <CalendarCard />
                    <ActivitiesList activities={activities} />
                </div>
               <div style={{ transform: 'translateX(-40px)' }}>
                 <NewsFeed items={newsItems} />
               </div>


            </div>
        </div>
    );
}

export default Dashboard;
