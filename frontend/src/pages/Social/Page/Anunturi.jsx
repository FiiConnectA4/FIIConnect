import React, { useState, useEffect } from "react";
import "../Style/Anunturi.css";

function Anunturi() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    message: "",
    tags: []
  });
  const [currentTag, setCurrentTag] = useState({
    name: "",
    type: "GENERAL"
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [fullUser, setFullUser] = useState(null);
  const [userTags, setUserTags] = useState([]);

  const fetchUserData = async () => {
    try {
      setUserLoading(true);
      const token = localStorage.getItem('token');
      // Fetch current user
      const authResponse = await fetch("http://localhost:34101/auth/current-user", {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
      if (!authResponse.ok) throw new Error("Failed to fetch current user");
      const authUser = await authResponse.json();
      setCurrentUser(authUser);

      // Fetch user details 
      const userResponse = await fetch(`http://localhost:34101/users/${authUser.id}`);
      if (!userResponse.ok) throw new Error("Failed to fetch user details");
      const userDetails = await userResponse.json();
      setFullUser(userDetails);

      // Fetch user tags from join table
      const tagsResponse = await fetch(`http://localhost:34101/users/${authUser.id}/tags`);
      if (!tagsResponse.ok) throw new Error("Failed to fetch user tags");
      const tagsData = await tagsResponse.json();
      
      console.log("User tags from API:", tagsData);
      setUserTags(tagsData);

      return { ...userDetails, tags: tagsData };
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err.message);
      throw err;
    } finally {
      setUserLoading(false);
    }
  };

  const fetchAnnouncements = async (user) => {
    try {
      setLoading(true);
      let url = "http://localhost:34101/announcement/prof-secretar";
      
      if (user.type === "Student") {
        const tagIds = user.tags?.map(tag => tag.id) || [];
        if (tagIds.length > 0) {
          url = `http://localhost:34101/announcement/with-tag?${tagIds.map(id => `tagIds=${id}`).join('&')}`;
        } else {
          setAnnouncements([]);
          return;
        }
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch announcements");
      let announcementsData = await response.json();

      // Sort by date (newest first)
      announcementsData = announcementsData.sort((a, b) => {
        return new Date(b.publishedDate) - new Date(a.publishedDate);
      });

      setAnnouncements(announcementsData);
    } catch (err) {
      setError("Failed to load announcements: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await fetchUserData();
        await fetchAnnouncements(user);
      } catch (err) {
        console.error("Initialization error:", err);
      }
    };

    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAnnouncement(prev => ({ ...prev, [name]: value }));
  };

  const handleTagInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTag(prev => ({ ...prev, [name]: value }));
  };

  const addTag = () => {
    setError(null);

    const tagName = currentTag.name.trim();
    const tagType = currentTag.type;

    if (!tagName) {
      setError("Te rugăm să introduci un nume pentru etichetă");
      return;
    }

    if (userTags.length === 0) {
      setError("Nu ai nicio etichetă atribuită. Contactează administratorul.");
      return;
    }

    // Check for duplicates (case insensitive)
    const isDuplicate = newAnnouncement.tags.some(
      tag => tag.name.toLowerCase() === tagName.toLowerCase() && tag.type === tagType
    );

    if (isDuplicate) {
      setError(`Eticheta "${tagName}" (${tagType}) a fost deja adăugată`);
      return;
    }

    // Verify user has this tag
    const userHasTag = userTags.some(
      tag => tag.name.toLowerCase() === tagName.toLowerCase() && tag.type === tagType
    );

    if (!userHasTag) {
      setError(`Nu ai permisiunea să folosești eticheta "${tagName}" (${tagType})`);
      return;
    }

    // Add the tag
    setNewAnnouncement(prev => ({
      ...prev,
      tags: [...prev.tags, { name: tagName, type: tagType }]
    }));

    // Reset input
    setCurrentTag({ name: "", type: "GENERAL" });
  };

  const removeTag = (index) => {
    setNewAnnouncement(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (userLoading) {
        throw new Error("Datele utilizatorului se încarcă. Te rugăm să aștepți...");
      }

      if (!fullUser) {
        throw new Error("Informațiile utilizatorului nu sunt disponibile.");
      }

      if (!newAnnouncement.title.trim()) {
        throw new Error("Te rugăm să introduci un titlu");
      }

      if (!newAnnouncement.message.trim()) {
        throw new Error("Te rugăm să introduci un mesaj");
      }

      const payload = {
        title: newAnnouncement.title.trim(),
        message: newAnnouncement.message.trim(),
        professor: {
          id: fullUser.id,
          name: fullUser.name,
          type: fullUser.type
        },
        tags: newAnnouncement.tags,
        publishedDate: new Date().toISOString()
      };

      const response = await fetch("http://localhost:34101/announcement/prof-secretar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Eroare la postarea anunțului");
      }
      
      setShowModal(false);
      setNewAnnouncement({ title: "", message: "", tags: [] });
      await fetchAnnouncements(fullUser);
    } catch (err) {
      setError(err.message);
    }
  };

  const filterAnnouncements = (allAnnouncements, tags) => {
    if (!tags || tags.length === 0) return [];
    
    return allAnnouncements.filter(announcement => {
      if (!announcement.tags || announcement.tags.length === 0) return true;
      return announcement.tags.some(announcementTag => 
        tags.some(userTag => 
          userTag.name === announcementTag.name && 
          userTag.type === announcementTag.type
        )
      );
    });
  };

  if (userLoading) return <div className="loading">Se încarcă datele utilizatorului...</div>;
  if (loading) return <div className="loading">Se încarcă anunțurile...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!fullUser) return <div className="error">Datele utilizatorului nu sunt disponibile</div>;

  const announcementsToDisplay = fullUser.type === "Student"
    ? filterAnnouncements(announcements, userTags)
    : announcements;

  return (
    <div className="announcements-container">
      <div className="announcements-header">
        <h1>Anunțuri</h1>
        {(fullUser.type === "Profesor" || fullUser.type === "Secretar") && (
          <button 
            className="add-button"
            onClick={() => setShowModal(true)}
            disabled={userLoading}
          >
            +
          </button>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Adaugă Anunț Nou</h2>
            {error && <div className="error-message">{error}</div>}
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
                    disabled={userLoading || userTags.length === 0}
                  />
                  <select
                    name="type"
                    value={currentTag.type}
                    onChange={handleTagInputChange}
                    disabled={userLoading || userTags.length === 0}
                  >
                    <option value="GENERAL">GENERAL</option>
                    <option value="MATERIE">MATERIE</option>
                    <option value="AN">AN</option>
                    <option value="SEMINAR">SEMINAR</option>
                    <option value="GRUPA">GRUPA</option>
                  </select>
                  <button 
                    type="button" 
                    onClick={addTag}
                    className="add-tag-button"
                    disabled={userLoading || userTags.length === 0}
                  >
                    Adaugă
                  </button>
                </div>
                
                {userTags.length === 0 && (
                  <div className="no-tags-warning">
                    Nu ai nicio etichetă atribuită. Contactează administratorul.
                  </div>
                )}
                
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
                <button type="submit" disabled={userLoading}>
                  Postează
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowModal(false);
                    setError(null);
                  }}
                >
                  Anulează
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="announcements-list">
        {announcementsToDisplay.length === 0 ? (
          <p>Nu există anunțuri disponibile.</p>
        ) : (
          announcementsToDisplay.map((announcement) => (
            <div key={announcement.id} className="announcement-card">
              <div className="announcement-header">
                <h2>{announcement.title}</h2>
                <div className="announcement-meta">
                  <span className="announcement-author-date">
                    {announcement.professor && (
                      <span className="announcement-author">
                        Postat de: {announcement.professor.name}
                        <span className="separator"> • </span>
                      </span>
                    )}
                    {announcement.publishedDate && (
                      <span className="announcement-date">
                        {new Date(announcement.publishedDate).toLocaleDateString('ro-RO', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    )}
                  </span>
                </div>
              </div>
              <p className="announcement-message">{announcement.message}</p>
              {announcement.tags && announcement.tags.length > 0 && (
                <div className="announcement-tags-container">
                  <div className="announcement-tags-header">Destinatar:</div>
                  <div className="announcement-tags">
                    {announcement.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className={`tag ${tag.type.toLowerCase()}`}
                        title={tag.type}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
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