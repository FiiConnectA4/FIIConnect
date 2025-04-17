import React, { useState, useEffect } from "react";
import "../styles/Anunturi.css";

function Anunturi() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch announcements from your backend API
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:34101/anunturi"); // Replace with your backend URL
      if (!response.ok) {
        throw new Error("Failed to fetch announcements");
      }
      const data = await response.json();
      setAnnouncements(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch announcements");
      setLoading(false);
      console.error("Error fetching announcements:", err);
    }
  };

  if (loading) return <div>Loading announcements...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="announcements-container">
      <div className="announcements-header">
        <h1 className="announcements-title">Anunțuri</h1>
      </div>

      <div className="announcements-list">
        {announcements.length === 0 ? (
          <p>No announcements available.</p>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement.id} className="announcement-box">
              <div className="announcement-header">
                <span>{announcement.title}</span>
              </div>
              <div className="announcement-content">
                <input
                  type="text"
                  className="announcement-input"
                  value={announcement.message}  // Assuming 'message' is the content
                  readOnly
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Anunturi;
