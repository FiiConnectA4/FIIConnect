// src/components/DashboardWidgets/NewsFeed.jsx
import './NewsFeed.css'; // dacă vrei fișier separat

export default function NewsFeed({ items }) {
    return (
        <div className="news-feed">
            <h3>News Feed</h3>
            <ul>
                {items.map(n => (
                    <li key={n.id}>{n.text}</li>
                ))}
            </ul>
        </div>
    );
}
