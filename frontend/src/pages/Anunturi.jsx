import React, { useState, useEffect } from "react";
import "../styles/Anunturi.css";

function Anunturi() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    message: "",
    tags: []
  });
  const [currentTag, setCurrentTag] = useState({
    name: "",
    type: "GENERAL" // Default type
  });

  // Hardcoded professor data
  const professor = {
    name: "Petru",
    tags: [
      { name: "A4", type: "GENERAL" },
      { name: "A1", type: "GENERAL" }
    ]
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch("http://localhost:34101/announcement");
      if (!response.ok) throw new Error("Failed to fetch announcements");
      const data = await response.json();
      const sortedData = data.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return b.id - a.id;
      });
      setAnnouncements(sortedData);
    } catch (err) {
      setError("Failed to load announcements: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAnnouncement(prev => ({ ...prev, [name]: value }));
  };

  const handleTagInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTag(prev => ({ ...prev, [name]: value }));
  };

  const addTag = () => {
    if (currentTag.name.trim()) {
      setNewAnnouncement(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag]
      }));
      setCurrentTag({ name: "", type: "GENERAL" });
    }
  };

  const removeTag = (index) => {
    setNewAnnouncement(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:34101/announcement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newAnnouncement.title,
          message: newAnnouncement.message,
          professor: professor,
          tags: newAnnouncement.tags
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to post announcement");
      }
      
      setShowModal(false);
      setNewAnnouncement({ title: "", message: "", tags: [] });
      fetchAnnouncements(); // Refresh the list
    } catch (err) {
      setError("Failed to post announcement: " + err.message);
    }
  };

  if (loading) return <div className="loading">Loading announcements...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="announcements-container">
      <div className="announcements-header">
        <h1>Anunțuri</h1>
        <button 
          className="add-button"
          onClick={() => setShowModal(true)}
        >
          +
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Adaugă Anunț Nou</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Titlu:</label>
                <input
                  type="text"
                  name="title"
                  value={newAnnouncement.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mesaj:</label>
                <textarea
                  name="message"
                  value={newAnnouncement.message}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Adaugă Etichete:</label>
                <div className="tag-input-container">
                  <input
                    type="text"
                    name="name"
                    placeholder="Nume etichetă"
                    value={currentTag.name}
                    onChange={handleTagInputChange}
                  />
                  <select
                    name="type"
                    value={currentTag.type}
                    onChange={handleTagInputChange}
                  >
                    <option value="GENERAL">GENERAL</option>
                    <option value="SPECIFIC">SPECIFIC</option>
                  </select>
                  <button 
                    type="button" 
                    onClick={addTag}
                    className="add-tag-button"
                  >
                    Adaugă
                  </button>
                </div>
                
                <div className="tags-list">
                  {newAnnouncement.tags.map((tag, index) => (
                    <div key={index} className="tag-item">
                      <span>{tag.name} ({tag.type})</span>
                      <button 
                        type="button" 
                        onClick={() => removeTag(index)}
                        className="remove-tag-button"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit">Postează</button>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                >
                  Anulează
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="announcements-list">
        {announcements.length === 0 ? (
          <p>Nu există anunțuri disponibile.</p>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement.id} className="announcement-card">
              <h2>{announcement.title}</h2>
              {announcement.createdAt && (
                <p className="announcement-date">
                  {new Date(announcement.createdAt).toLocaleDateString('ro-RO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              )}
              <p className="announcement-message">{announcement.message}</p>
              {announcement.tags && announcement.tags.length > 0 && (
                <div className="announcement-tags">
                  {announcement.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag.name} ({tag.type})
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Anunturi;