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
      // Replace this with your actual API endpoint
      // const response = await fetch('your-api-endpoint/announcements');
      // const data = await response.json();
      
      // For demonstration, using mock data with consistent titles
      const mockData = [
        { id: 1, title: "Title", content: "This is the first announcement content." },
        { id: 2, title: "Title", content: "This is the second announcement content." },
        { id: 3, title: "Title", content: "This is the third announcement content." },
        // Add more mock announcements to test scrolling
        { id: 4, title: "Title", content: "This is the fourth announcement content." },
        { id: 5, title: "Title", content: "This is the fifth announcement content." },
      ];
      
      // Simulate API delay
      setTimeout(() => {
        setAnnouncements(mockData);
        setLoading(false);
      }, 500);
      
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
                  value={announcement.content}
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