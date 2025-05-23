
import './ActivitiesList.css';

function ActivitiesList({ activities }) {
    return (
        <div className="activities-list">
            <h3>Ultimele activități</h3>
            <ul>
                {activities.map((a, idx) => (
                    <li key={idx}>
                        <span className="activity-title">{a.title}</span>
                        <span className="activity-time">{a.time}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default ActivitiesList;
