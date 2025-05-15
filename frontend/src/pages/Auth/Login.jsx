import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../styles/FiiConnect-removebg-preview.png"
import "../../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/app/dashboard");
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setError(false);

    try {
      const { data } = await axios.post("http://localhost:34101/users/login", {
        username,
        password,
      });

      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/app/dashboard");
        return;
      }

      if (data.message === "2FA_REQUIRED") {
        navigate("/app/2fa", { state: { username } });
        return;
      }

      throw new Error("Răspuns necunoscut de la server.");
    } catch (err) {
      console.error("Eroare la login:", err);
      setError(true);
      alert("Autentificare eșuată. Verifică datele introduse!");
    }
  };

  return (
      <div className="login-container">
        <div className="login-box">
          <img
              src={logo}
              alt="FIIConnect"
              className="logo"
          />
          <h2 className="subtitle">NICE TO SEE YOU AGAIN</h2>

          <form className="login-form" onSubmit={handleLogin}>
            <input
                className={`input ${error ? "input-error" : ""}`}
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
            />
            <input
                className={`input ${error ? "input-error" : ""}`}
                type="password"
                placeholder="Parola"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
            />

            <div className="forgot">
              <a href="/forgot-password">Ai uitat parola?</a>
            </div>

            <button className="login-button" type="submit">
              Continuă
            </button>
          </form>

          <p className="copyright">© FIIConnect</p>
        </div>
      </div>
  );
};

export default Login;
