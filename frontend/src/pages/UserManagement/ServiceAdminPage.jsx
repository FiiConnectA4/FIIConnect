import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/ServiceAdminPage.css"; // Import the CSS file

function ServiceAdminPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [serverTime, setServerTime] = useState("");
  const [usersCount, setUsersCount] = useState(null);
  const [searchUsername, setSearchUsername] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loadingUserCount, setLoadingUserCount] = useState(false);
  const [loadingRecentUsers, setLoadingRecentUsers] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);


  // Function to get token, handling potential errors
  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authentication token not found. Redirecting to login.");
      navigate("/"); // Or your login page
      return null;
    }
    return token;
  };


  const fetchStatus = async () => {
    const token = getToken();
    if (!token) return;
    setLoadingStatus(true);
    try {
      const res = await axios.get("http://localhost:34101/admin/status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatus(res.data.status);
      setServerTime(res.data.serverTime);
    } catch (err) {
      console.error("Eroare la status:", err.response ? err.response.data : err.message);
      setStatus("Eroare la încărcare");
    } finally {
      setLoadingStatus(false);
    }
  };

  const fetchUsersCount = async () => {
    const token = getToken();
    if (!token) return;
    setLoadingUserCount(true);
    try {
      const res = await axios.get("http://localhost:34101/admin/users-count", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsersCount(res.data.count);
    } catch (err) {
      console.error("Eroare la numărare useri:", err.response ? err.response.data : err.message);
      setUsersCount("Eroare");
    } finally {
      setLoadingUserCount(false);
    }
  };

  const fetchRecentUsers = async () => {
    const token = getToken();
    if (!token) return;
    setLoadingRecentUsers(true);
    try {
      const res = await axios.get("http://localhost:34101/admin/recent-users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecentUsers(res.data);
    } catch (err) {
      console.error("Eroare la utilizatori recenți:", err.response ? err.response.data : err.message);
      setRecentUsers([]); // Set to empty array on error
    } finally {
      setLoadingRecentUsers(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchUsersCount();
    fetchRecentUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // navigate is stable, getToken is not a dependency here

  const handleUserSearch = async () => {
    if (!searchUsername.trim()) {
      setSearchedUser({ error: "Introduceți un nume de utilizator." });
      return;
    }
    const token = getToken();
    if (!token) return;
    setLoadingSearch(true);
    try {
      const res = await axios.get(`http://localhost:34101/admin/user/${searchUsername}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSearchedUser(res.data);
    } catch (err) {
      console.error("Eroare la căutare utilizator:", err.response ? err.response.data : err.message);
      if (err.response && err.response.status === 404) {
        setSearchedUser({ error: "Utilizator inexistent sau nu a fost găsit." });
      } else {
        setSearchedUser({ error: "Eroare la căutarea utilizatorului." });
      }
    } finally {
      setLoadingSearch(false);
    }
  };

  return (
      <div className="service-admin-container">
        <button
            className="service-admin-button back-button"
            onClick={() => navigate("/app/dashboard")}
        >
          ← Înapoi la Dashboard
        </button>

        <h1 className="service-admin-title">🛠️ Pagina de Service Admin</h1>

        <div className="service-admin-card">
          <h2>📊 Status aplicație</h2>
          <p><strong>Stare:</strong> {loadingStatus ? "Se încarcă..." : (status || "N/A")}</p>
          <p><strong>Server time:</strong> {loadingStatus ? "Se încarcă..." : (serverTime || "N/A")}</p>
          <button className="service-admin-button" onClick={fetchStatus} disabled={loadingStatus}>
            {loadingStatus ? "Se reîncarcă..." : "🔁 Reîncarcă"}
          </button>
        </div>

        <div className="service-admin-card">
          <h2>👥 Utilizatori</h2>
          <p><strong>Total utilizatori:</strong> {loadingUserCount ? "Se încarcă..." : (usersCount !== null ? usersCount : "N/A")}</p>
          {/* Optional: Button to refresh user count if needed */}
          {/* <button className="service-admin-button" onClick={fetchUsersCount} disabled={loadingUserCount}>
          {loadingUserCount ? "Se reîncarcă..." : "🔁 Reîncarcă Contor"}
        </button> */}
        </div>

        <div className="service-admin-card">
          <h2>🔍 Căutare utilizator</h2>
          <input
              className="service-admin-input"
              type="text"
              placeholder="username"
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleUserSearch()}
              disabled={loadingSearch}
          />
          <button className="service-admin-button" onClick={handleUserSearch} disabled={loadingSearch}>
            {loadingSearch ? "Se caută..." : "Caută"}
          </button>

          {searchedUser && (
              <div className="user-search-result">
                {searchedUser.error ? (
                    <p className="error-message">{searchedUser.error}</p>
                ) : (
                    <div>
                      <p><strong>Username:</strong> {searchedUser.username || "N/A"}</p>
                      <p><strong>Email:</strong> {searchedUser.email || "N/A"}</p>
                      <p><strong>Rol:</strong> {searchedUser.role || "N/A"}</p>
                      <p><strong>Activ:</strong> {typeof searchedUser.active === 'boolean' ? (searchedUser.active ? "Da ✅" : "Nu ❌") : "N/A"}</p>
                    </div>
                )}
              </div>
          )}
        </div>

        <div className="service-admin-card">
          <h2>📋 Ultimii utilizatori înregistrați</h2>
          {loadingRecentUsers ? <p>Se încarcă utilizatorii recenți...</p> :
              recentUsers.length > 0 ? (
                  <table className="service-admin-table">
                    <thead>
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Activ</th>
                    </tr>
                    </thead>
                    <tbody>
                    {recentUsers.map((user) => (
                        <tr key={user.id || user.username}> {/* Added fallback key */}
                          <td>{user.username || "N/A"}</td>
                          <td>{user.email || "N/A"}</td>
                          <td>{user.role || "N/A"}</td>
                          <td>{typeof user.active === 'boolean' ? (user.active ? "✅" : "❌") : "N/A"}</td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
              ) : (
                  <p>Nu există utilizatori recenți de afișat.</p>
              )
          }
          <button className="service-admin-button" onClick={fetchRecentUsers} disabled={loadingRecentUsers} style={{marginTop: '1rem'}}>
            {loadingRecentUsers ? "Se reîncarcă..." : "🔁 Reîncarcă Lista"}
          </button>
        </div>
      </div>
  );
}

export default ServiceAdminPage;
