// src/components/DashboardWidgets/InfoCard.jsx
import './InfoCard.css';

function InfoCard({ icon, title, value }) {
    return (
        <div className="info-card">
            <span className="info-card-icon">{icon}</span>
            <span className="info-card-title">{title}</span>
            <span className="info-card-value">{value}</span>
        </div>
    );
}
export default InfoCard;
