import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/app/dashboard");
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    // curăță eventualul token vechi
    localStorage.removeItem("token");

    try {
      const { data } = await axios.post(
          "http://localhost:34101/users/login",
          { username, password }
      );

      // ● SCENARIUL 1 — autentificare normală (fără 2FA)
      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/app/dashboard");
        return;
      }

      // ● SCENARIUL 2 — 2FA necesar
      if (data.message === "2FA_REQUIRED") {
        // Trimitem doar username-ul către pagina 2FA
        navigate("/app/2fa", { state: { username } });
        return;
      }

      // ● Orice alt răspuns neașteptat
      throw new Error("Răspuns necunoscut de la server.");
    } catch (err) {
      console.error("Eroare la login:", err);
      alert("Autentificare eșuată. Verifică datele introduse!");
    }
  };

  return (
      <div className="login-wrapper">
        <form className="login-card" onSubmit={handleLogin}>
          <h1>Autentificare</h1>

          <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
          />

          <input
              type="password"
              placeholder="Parola"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
          />

          <button type="submit">Continuă</button>
        </form>
      </div>
  );
};

export default Login;
