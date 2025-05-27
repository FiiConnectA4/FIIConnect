import { useEffect, useState } from "react";
import axios from "axios";

function ServiceAdminPage() {
  const [status, setStatus] = useState(null);
  const [serverTime, setServerTime] = useState("");
  const [usersCount, setUsersCount] = useState(null);
  const [searchUsername, setSearchUsername] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    fetchStatus();
    fetchUsersCount();
    fetchRecentUsers();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await axios.get("http://localhost:34101/admin/status", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setStatus(res.data.status);
      setServerTime(res.data.serverTime);
    } catch (err) {
      console.error("Eroare la status:", err);
    }
  };

  const fetchUsersCount = async () => {
    try {
      const res = await axios.get("http://localhost:34101/admin/users-count", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsersCount(res.data.count);
    } catch (err) {
      console.error("Eroare la numărare useri:", err);
    }
  };

  const fetchRecentUsers = async () => {
    try {
      const res = await axios.get("http://localhost:34101/admin/recent-users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRecentUsers(res.data);
    } catch (err) {
      console.error("Eroare la utilizatori recenți:", err);
    }
  };

  const handleUserSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:34101/admin/user/${searchUsername}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSearchedUser(res.data);
    } catch (err) {
      setSearchedUser({ error: "Utilizator inexistent" });
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🛠️ Pagina de Service Admin</h1>

      <div style={styles.card}>
        <h2>📊 Status aplicație</h2>
        <p><strong>Stare:</strong> {status || "Se încarcă..."}</p>
        <p><strong>Server time:</strong> {serverTime}</p>
        <button style={styles.button} onClick={fetchStatus}>🔁 Reîncarcă</button>
      </div>

      <div style={styles.card}>
        <h2>👥 Utilizatori</h2>
        <p><strong>Total utilizatori:</strong> {usersCount !== null ? usersCount : "..."}</p>
      </div>

      <div style={styles.card}>
        <h2>🔍 Căutare utilizator</h2>
        <input
          style={styles.input}
          type="text"
          placeholder="username"
          value={searchUsername}
          onChange={(e) => setSearchUsername(e.target.value)}
        />
        <button style={styles.button} onClick={handleUserSearch}>Caută</button>

        {searchedUser && (
          <div style={{ marginTop: "1rem" }}>
            {searchedUser.error ? (
              <p style={{ color: "red" }}>{searchedUser.error}</p>
            ) : (
              <div>
                <p><strong>Username:</strong> {searchedUser.username}</p>
                <p><strong>Email:</strong> {searchedUser.email}</p>
                <p><strong>Rol:</strong> {searchedUser.role}</p>
                <p><strong>Activ:</strong> {searchedUser.active ? "Da" : "Nu"}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={styles.card}>
        <h2>📋 Ultimii utilizatori înregistrați</h2>
        <table style={styles.table}>
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
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.active ? "✅" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    backgroundColor: "#f5f7fa",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    marginBottom: "2rem",
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    padding: "1.5rem",
    marginBottom: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  button: {
    marginTop: "0.5rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  input: {
    padding: "0.5rem",
    marginRight: "1rem",
    width: "200px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem",
  },
  th: {
    borderBottom: "1px solid #ddd",
    padding: "0.5rem",
  },
  td: {
    padding: "0.5rem",
    textAlign: "center",
  },
};

export default ServiceAdminPage;
