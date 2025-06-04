import React, { useState, useEffect } from "react";
import "../Style/Anunturi.css";
import { API_ROUTES } from '../../../app/router';

function Notification({ message, type, onClose }) {
  return (
    <div className={`notification ${type}`}>
      <span className="notification-message" title={message}>
        {message}
      </span>
      <button 
        className="notification-close" 
        onClick={onClose}
        aria-label="Închide notificarea"
      >
        ×
      </button>
    </div>
  );
}

function Anunturi() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [availableTagTypes, setAvailableTagTypes] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    message: "",
    tags: []
  });

  const [currentTag, setCurrentTag] = useState({
    name: "",
    type: "GENERAL"
  });

  const [notification, setNotification] = useState(null);

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const [currentUser, setCurrentUser] = useState(null);
  const [fullUser, setFullUser] = useState(null);
  const [userTags, setUserTags] = useState([]);

  // Helper function to normalize user type
  const normalizeUserType = (type) => {
    if (!type) return null;
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  // Fetch user info, tags, and role from unified endpoint
  const fetchUserData = async () => {
    try {
      setUserLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(API_ROUTES.PERSON_ME, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch user info');
      const user = await response.json();
      setFullUser(user);
      setUserTags(user.tags || []);
      // Extract unique tag types
      const uniqueTypes = [...new Set((user.tags || []).map(tag => tag.type))];
      setAvailableTagTypes(uniqueTypes);
      setCurrentTag(prev => ({ ...prev, type: uniqueTypes[0] || 'GENERAL' }));
      return user;
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err.message);
      throw err;
    } finally {
      setUserLoading(false);
    }
  };

  // Fetch announcements using user info and tags
  const fetchAnnouncements = async (user) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      let url = API_ROUTES.ANNOUNCEMENT_PROF_SECRETAR;
      if (user.role === 'student') {
        const tagIds = user.tags?.map(tag => tag.id) || [];
        if (tagIds.length > 0) {
          url = `${API_ROUTES.ANNOUNCEMENT_WITH_TAG}?${tagIds.map(id => `tagIds=${id}`).join('&')}`;
        } else {
          setAnnouncements([]);
          return;
        }
      }
      const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) throw new Error('Failed to fetch announcements');
      let announcementsData = await response.json();
      announcementsData = announcementsData.map(announcement => ({
        ...announcement,
        author: announcement.author || null,
        professor: announcement.author ? {
          id: announcement.author.userId, // use userId for author
          name: announcement.author.username || announcement.author.name || '',
          type: normalizeUserType(announcement.author.role || announcement.author.type)
        } : null
      }));
      announcementsData.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
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

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingAnnouncement(prev => ({ ...prev, [name]: value }));
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
      setError("Te rugăm să selectezi o etichetă");
      return;
    }

    // Verifică doar dacă tag-ul există deja în anunțul curent
    const isDuplicate = newAnnouncement.tags.some(
      tag => tag.name.toLowerCase() === tagName.toLowerCase() && tag.type === tagType
    );

    if (isDuplicate) {
      showNotification(`Eticheta "${tagName}" (${tagType}) există deja`, 'error');
      return;
    }

    // Verifică doar dacă utilizatorul are dreptul să folosească tag-ul
    const userHasTag = userTags.some(
      tag => tag.name.toLowerCase() === tagName.toLowerCase() && tag.type === tagType
    );

    if (!userHasTag) {
      setError(`Nu ai permisiunea să folosești eticheta "${tagName}" (${tagType})`);
      return;
    }

    // Adaugă tag-ul
    setNewAnnouncement(prev => ({
      ...prev,
      tags: [...prev.tags, { name: tagName, type: tagType }]
    }));

    // Resetare input
    setCurrentTag(prev => ({ ...prev, name: "" }));
  };

  const addEditTag = () => {
    setError(null);

    const tagName = currentTag.name.trim();
    const tagType = currentTag.type;

    if (!tagName) {
      setError("Te rugăm să selectezi o etichetă");
      return;
    }

    // Verifică doar dacă tag-ul există deja în anunțul curent
    const isDuplicate = editingAnnouncement.tags.some(
      tag => tag.name.toLowerCase() === tagName.toLowerCase() && tag.type === tagType
    );

    if (isDuplicate) {
      showNotification(`Eticheta "${tagName}" (${tagType}) există deja`, 'error');
      return;
    }

    // Verifică doar dacă utilizatorul are dreptul să folosească tag-ul
    const userHasTag = userTags.some(
      tag => tag.name.toLowerCase() === tagName.toLowerCase() && tag.type === tagType
    );

    if (!userHasTag) {
      setError(`Nu ai permisiunea să folosești eticheta "${tagName}" (${tagType})`);
      return;
    }

    // Adaugă tag-ul
    setEditingAnnouncement(prev => ({
      ...prev,
      tags: [...prev.tags, { name: tagName, type: tagType }]
    }));

    // Resetare input
    setCurrentTag(prev => ({ ...prev, name: "" }));
  };

  const removeTag = (index) => {
    setNewAnnouncement(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const removeEditTag = (index) => {
    setEditingAnnouncement(prev => ({
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
      const token = localStorage.getItem('token');
      // Compose payload as expected by backend: AnnouncementDTO
      const payload = {
        title: newAnnouncement.title.trim(),
        message: newAnnouncement.message.trim(),
        authorId: fullUser.userId, // send only the userId
        tags: newAnnouncement.tags.map(tag => ({ name: tag.name, type: tag.type })),
        publishedDate: new Date().toISOString().split('T')[0] // LocalDate format (yyyy-MM-dd)
      };
      // Înlocuirea URL-ului hardcodat cu ruta centralizată
      const response = await fetch(API_ROUTES.ANNOUNCEMENT_PROF_SECRETAR, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        let errorData = {};
        try { errorData = await response.json(); } catch { /* ignore */ }
        throw new Error(errorData.message || "Eroare la postarea anunțului");
      }
      setShowModal(false);
      setNewAnnouncement({ title: "", message: "", tags: [] });
      setCurrentTag({ name: "", type: availableTagTypes[0] || "GENERAL" });
      await fetchAnnouncements(fullUser);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (userLoading) {
        throw new Error("Datele utilizatorului se încarcă. Te rugăm să aștepți...");
      }
      if (!fullUser) {
        throw new Error("Informațiile utilizatorului nu sunt disponibile.");
      }
      if (!editingAnnouncement.title.trim()) {
        throw new Error("Te rugăm să introduci un titlu");
      }
      if (!editingAnnouncement.message.trim()) {
        throw new Error("Te rugăm să introduci un mesaj");
      }
      const token = localStorage.getItem('token');
      const payload = {
        title: editingAnnouncement.title.trim(),
        message: editingAnnouncement.message.trim(),
        authorId: fullUser.userId, // send only the userId
        tags: editingAnnouncement.tags.map(tag => ({ name: tag.name, type: tag.type })),
        publishedDate: editingAnnouncement.publishedDate
      };
      // Înlocuirea URL-ului pentru actualizare
      const response = await fetch(`${API_ROUTES.ANNOUNCEMENT_PROF_SECRETAR}/${editingAnnouncement.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        let errorData = {};
        try { errorData = await response.json(); } catch { /* ignore */ }
        throw new Error(errorData.message || "Eroare la actualizarea anunțului");
      }
      setShowEditModal(false);
      setEditingAnnouncement(null);
      setCurrentTag({ name: "", type: availableTagTypes[0] || "GENERAL" });
      await fetchAnnouncements(fullUser);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (announcementId) => {
    try {
      if (!window.confirm("Sigur dorești să ștergi acest anunț?")) {
        return;
      }
      const token = localStorage.getItem('token');
      // Înlocuirea URL-ului pentru ștergere
      const response = await fetch(`${API_ROUTES.ANNOUNCEMENT_PROF_SECRETAR}/${announcementId}?userId=${fullUser.userId}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error("Eroare la ștergerea anunțului");
      }
      await fetchAnnouncements(fullUser);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (announcement) => {
    setEditingAnnouncement({
      id: announcement.id,
      title: announcement.title,
      message: announcement.message,
      tags: announcement.tags || [],
      publishedDate: announcement.publishedDate
    });
    setShowEditModal(true);
  };

  const handleTagTypeChange = (e) => {
    const newType = e.target.value;
    setCurrentTag({
      name: "", // Reset name when type changes
      type: newType
    });
  };

  // Helper to get available tag names for a given type and current tags
  const getAvailableTagNames = (selectedType, currentTags = []) => {
    if (!userTags || userTags.length === 0) return { names: [], hasAvailableTags: false };
    const filteredTags = userTags
      .filter(tag => tag.type === selectedType)
      .filter(tag => !currentTags.some(t => t.name === tag.name && t.type === tag.type));
    return {
      names: filteredTags.map(tag => tag.name),
      hasAvailableTags: filteredTags.length > 0
    };
  };

  const filterAnnouncements = (allAnnouncements, tags) => {
    if (!tags || tags.length === 0) return [];
    return allAnnouncements.filter(announcement => {
      if (!announcement.tags || announcement.tags.length === 0) return false;
      return announcement.tags.some(announcementTag =>
        tags.some(userTag =>
          userTag.name === announcementTag.name &&
          userTag.type === announcementTag.type
        )
      );
    });
  };

  // Helper to check if user can post (not a student)
  const canPost = fullUser && fullUser.role && fullUser.role !== 'ROLE_STUDENT';

  // Only students see filtered announcements, others see all
  const isStudent = fullUser && fullUser.role === 'ROLE_STUDENT';
  const uniqueAnnouncements = Array.from(new Map(announcements.map(a => [a.id, a])).values());
  const announcementsToDisplay = isStudent
    ? filterAnnouncements(uniqueAnnouncements, userTags)
    : uniqueAnnouncements;

  if (userLoading) return <div className="loading">Se încarcă datele utilizatorului...</div>;
  if (loading) return <div className="loading">Se încarcă anunțurile...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!fullUser) return <div className="error">Datele utilizatorului nu sunt disponibile</div>;

  console.log("Current user:", fullUser);

  return (
    <div className="announcements-container">
      <div className="announcements-header">
        <h1>Anunțuri</h1>
        {canPost && (
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
            {notification && (
              <Notification 
                message={notification.message} 
                type={notification.type} 
                onClose={() => setNotification(null)}
              />
            )}
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
                  <select
                    name="type"
                    value={currentTag.type}
                    onChange={handleTagTypeChange}
                    disabled={userLoading || userTags.length === 0}
                  >
                    {availableTagTypes.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  
                  {(() => {
                    const { names, hasAvailableTags } = getAvailableTagNames(currentTag.type, newAnnouncement.tags);
                    
                    if (!hasAvailableTags) {
                      return (
                        <div className="no-tags-message">
                          Nu mai ai etichete disponibile pentru acest tip
                        </div>
                      );
                    }
                    
                    return (
                      <select
                        name="name"
                        value={currentTag.name}
                        onChange={handleTagInputChange}
                        disabled={userLoading || userTags.length === 0 || !currentTag.type}
                      >
                        <option value="">Selectează etichetă</option>
                        {names.map(name => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                    );
                  })()}
                  
                  <button 
                    type="button" 
                    onClick={addTag}
                    className="add-tag-button"
                    disabled={userLoading || userTags.length === 0 || !currentTag.name}
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
                    setNotification(null);
                    setNewAnnouncement({ title: "", message: "", tags: [] });
                    setCurrentTag({ name: "", type: availableTagTypes[0] || "GENERAL" });
                  }}
                >
                  Anulează
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingAnnouncement && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Editează Anunț</h2>
            {notification && (
              <Notification 
                message={notification.message} 
                type={notification.type} 
                onClose={() => setNotification(null)}
              />
            )}
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Titlu:</label>
                <input
                  type="text"
                  name="title"
                  value={editingAnnouncement.title}
                  onChange={handleEditInputChange}
                  required  
                />
              </div>

              <div className="form-group">
                <label>Mesaj:</label>
                <textarea
                  name="message"
                  value={editingAnnouncement.message}
                  onChange={handleEditInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Etichete:</label>
                <div className="tag-input-container">
                  <select
                    name="type"
                    value={currentTag.type}
                    onChange={handleTagTypeChange}
                    disabled={userLoading || userTags.length === 0}
                  >
                    {availableTagTypes.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  
                  {(() => {
                    const { names, hasAvailableTags } = getAvailableTagNames(currentTag.type, editingAnnouncement.tags);
                    
                    if (!hasAvailableTags) {
                      return (
                        <div className="no-tags-message">
                          Nu mai ai etichete disponibile pentru acest tip
                        </div>
                      );
                    }
                    
                    return (
                      <select
                        name="name"
                        value={currentTag.name}
                        onChange={handleTagInputChange}
                        disabled={userLoading || userTags.length === 0 || !currentTag.type}
                      >
                        <option value="">Selectează etichetă</option>
                        {names.map(name => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                    );
                  })()}
                  
                  <button 
                    type="button" 
                    onClick={addEditTag}
                    className="add-tag-button"
                    disabled={userLoading || userTags.length === 0 || !currentTag.name}
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
                  {editingAnnouncement.tags.map((tag, index) => (
                    <div key={index} className="tag-item">
                      <span>{tag.name} ({tag.type})</span>
                      <button 
                        type="button" 
                        onClick={() => removeEditTag(index)}
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
                  Salvează
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowEditModal(false);
                    setError(null);
                    setNotification(null);
                    setNewAnnouncement({ title: "", message: "", tags: [] });
                    setCurrentTag({ name: "", type: availableTagTypes[0] || "GENERAL" });
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
                <div className="announcement-title-container">
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
                    {fullUser && (fullUser.userId === announcement.authorId || fullUser.userId === announcement.author) && (
                      <div className="announcement-actions">
                        <button 
                          className="edit-button"
                          onClick={() => handleEdit(announcement)}
                          title="Editează"
                        >
                          ✏️
                        </button>
                        <button 
                          className="delete-button"
                          onClick={() => handleDelete(announcement.id)}
                          title="Șterge"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
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