import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AtribuireTaguri.css";

const AtribuireTaguri = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [availableTagTypes, setAvailableTagTypes] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [currentTag, setCurrentTag] = useState({
    id: null,
    name: "",
    type: ""
  });
  const [userTags, setUserTags] = useState([]);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch current user info
  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:34101/person/me", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch current user");
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error fetching current user:", err);
      throw err;
    }
  };


// Fetch all users from the API
const fetchAllUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch("http://localhost:34101/person/get-all", {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("User JSON:", data); // Debug: verifică structura primită

    return data.map(user => {
      if (!user) return null;

      // Extragem doar câmpurile necesare din structura ta
      return {
        id: user.userId, // Folosim userId din răspuns
        name: `${user.lastName || ''} ${user.firstName || ''}`.trim() || 'Necunoscut',
        role: (user.role || 'unknown').toLowerCase(),
        // Am eliminat email-ul deoarece nu este prezent în structura ta
        tags: user.tags || [] // Păstrăm tag-urile dacă sunt necesare
      };
    }).filter(user => user !== null);
  } catch (err) {
    console.error("Error fetching users:", err);
    throw err;
  }
};


  // Fetch all tags from database
  const fetchAllTags = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:34101/tags", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch tags");
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error fetching tags:", err);
      throw err;
    }
  };

  // Fetch user tags
  const fetchUserTags = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:34101/manage_tags/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch user tags");
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error fetching user tags:", err);
      throw err;
    }
  };

  // Initial data loading
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const currentUserData = await fetchCurrentUser();
        setCurrentUser(currentUserData);

        const usersData = await fetchAllUsers();
        setUsers(usersData);
        setFilteredUsers(usersData);

        const tagsData = await fetchAllTags();
        setAllTags(tagsData);

        // Extract unique tag types from tags data
        const tagTypes = [...new Set(tagsData.map(tag => tag.type))];
        setAvailableTagTypes(tagTypes);
        
        if (tagTypes.length > 0) {
          setCurrentTag(prev => ({ ...prev, type: tagTypes[0] }));
        }

        setLoading(false);
      } catch (err) {
        console.error("Initialization error:", err);
        setError("Eroare la încărcarea datelor");
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Load tags when user is selected
  useEffect(() => {
    if (selectedUser) {
      const loadUserTags = async () => {
        try {
          const tags = await fetchUserTags(selectedUser.id);
          setUserTags(tags);
        } catch (err) {
          console.error("Error loading user tags:", err);
          setNotification({
            message: "Eroare la încărcarea tag-urilor utilizatorului",
            type: "error"
          });
        }
      };
      
      loadUserTags();
    } else {
      setUserTags([]);
    }
  }, [selectedUser]);

  // Filter users based on search term
  useEffect(() => {
  if (searchTerm.trim() === "") {
    setFilteredUsers(users);
  } else {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    console.log("Filtered Users:", filtered); // Adaugă asta pentru debug
  }
}, [searchTerm, users]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSelectedUser(null);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleTagTypeChange = (e) => {
    const newType = e.target.value;
    setCurrentTag({
      id: null,
      name: "",
      type: newType
    });
  };

  const handleTagNameChange = (e) => {
    const selectedTagId = e.target.value;
    const selectedTag = allTags.find(tag => tag.id.toString() === selectedTagId);
    
    setCurrentTag({
      id: selectedTag?.id || null,
      name: selectedTag?.name || "",
      type: selectedTag?.type || currentTag.type
    });
  };

  const getAvailableTagsForType = (type) => {
    if (!type) return [];
    return allTags
      .filter(tag => tag.type === type)
      .filter(tag => !userTags.some(userTag => userTag.id === tag.id));
  };

  const addTag = async () => {
    if (!selectedUser) {
      setError("Selectează mai întâi un utilizator");
      return;
    }

    if (!currentTag.id) {
      setError("Selectează un tag");
      return;
    }

    if (!currentUser) {
      setError("Nu s-a putut identifica utilizatorul curent");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const whoIsLoggedId = currentUser.id;
      
      const response = await fetch(
        `http://localhost:34101/manage_tags/${whoIsLoggedId}/${selectedUser.id}/${currentTag.id}`,
        {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || responseData);
      }

      // Refresh user tags after adding
      const updatedTags = await fetchUserTags(selectedUser.id);
      setUserTags(updatedTags);
      
      setNotification({
        message: `Tag-ul "${currentTag.name}" a fost adăugat`,
        type: "success"
      });
      
      // Reset tag selection
      setCurrentTag(prev => ({
        id: null,
        name: "",
        type: prev.type
      }));
    } catch (err) {
      console.error("Error adding tag:", err);
      setNotification({
        message: err.message || "Eroare la adăugarea tag-ului",
        type: "error"
      });
    }
  };

  const removeTag = async (tagId) => {
    if (!selectedUser || !currentUser) return;

    try {
      const token = localStorage.getItem('token');
      const whoIsLoggedId = currentUser.id;
      
      const response = await fetch(
        `http://localhost:34101/manage_tags/${whoIsLoggedId}/${selectedUser.id}/${tagId}`,
        {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || responseData);
      }

      // Refresh user tags after removal
      const updatedTags = await fetchUserTags(selectedUser.id);
      setUserTags(updatedTags);
      
      setNotification({
        message: "Tag-ul a fost eliminat",
        type: "success"
      });
    } catch (err) {
      console.error("Error removing tag:", err);
      setNotification({
        message: err.message || "Eroare la eliminarea tag-ului",
        type: "error"
      });
    }
  };

  if (loading) {
    return <div className="secretariat-container">Se încarcă...</div>;
  }

  return (
    <div className="secretariat-container">
      <button 
        className="switch-button" 
        style={{ marginBottom: '1.5rem', marginLeft: 0, marginTop: 0 }}
        onClick={() => navigate("/app/secretariat")}
      >
        Înapoi la Secretariat
      </button>
      <div className="secretariat-header">
        <div className="secretariat-titlu">
          <h1>Atribuire Tag-uri</h1>
          <h2>Atribuie tag-uri utilizatorilor</h2>
        </div>
      </div>

      <div className="atribuire-taguri-content">
        <div className="search-section">
          <input
            type="text"
            placeholder="Caută utilizator după nume sau email"
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          
          <div className="users-list">
  {filteredUsers.map(user => (
    <div
      key={user.id}
      className={`user-item ${selectedUser?.id === user.id ? 'selected' : ''}`}
      onClick={() => handleUserSelect(user)}
    >
      <div className="user-name">{user.name}</div>
      <div className="user-role">{user.role}</div>
      
    </div>
  ))}
</div>
        </div>

        {selectedUser && (
          <div className="tags-section">
            <h3>Tag-uri pentru {selectedUser.name}</h3>
            
            {notification && (
              <div className={`notification ${notification.type}`}>
                {notification.message}
                <button onClick={() => setNotification(null)}>×</button>
              </div>
            )}
            
            <div className="tag-input-container">
              <div className="dropdown-group">
                <label>Tip tag:</label>
                <select
                  value={currentTag.type}
                  onChange={handleTagTypeChange}
                >
                  {availableTagTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="dropdown-group">
                <label>Tag:</label>
                <select
                  value={currentTag.id || ""}
                  onChange={handleTagNameChange}
                  disabled={!currentTag.type}
                >
                  <option value="">Selectează un tag</option>
                  {getAvailableTagsForType(currentTag.type).map(tag => (
                    <option key={tag.id} value={tag.id}>{tag.name}</option>
                  ))}
                </select>
              </div>
              
              <button 
                className="add-tag-button"
                onClick={addTag}
                disabled={!currentTag.id}
              >
                Adaugă Tag
              </button>
            </div>
            
            <div className="user-tags-list">
              <h4>Tag-uri atribuite:</h4>
              {userTags.length === 0 ? (
                <p>Nu există tag-uri atribuite</p>
              ) : (
                <ul>
                  {userTags.map(tag => (
                    <li key={tag.id} className={`tag-item ${tag.type}`}>
                      <span className="tag-name">{tag.name}</span>
                      <span className={`tag-type ${tag.type}`}>{tag.type}</span>
                      <button 
                        className="remove-tag-button"
                        onClick={() => removeTag(tag.id)}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AtribuireTaguri;