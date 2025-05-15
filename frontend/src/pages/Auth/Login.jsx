import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      redirectByRole(decoded);
    }
  }, [navigate]);

  const redirectByRole = (decodedToken) => {
    const roles = decodedToken.roles || [];
    if (roles.includes("ROLE_STUDENT")) {
      navigate("/app/dashboard");
    } else if (roles.includes("ROLE_SECRETARY")) {
      navigate("/secretar");
    } else if (roles.includes("ROLE_ADMIN")) {
      navigate("/admin");
    } else {
      alert("Rol necunoscut. Contactează administratorul.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    localStorage.removeItem("token");

    try {
      const { data } = await axios.post("http://localhost:34101/users/login", {
        username,
        password
      });

      if (data.token) {
        localStorage.setItem("token", data.token);
        const decoded = jwtDecode(data.token);
        redirectByRole(decoded);
        return;
      }

      if (data.message === "2FA_REQUIRED") {
        navigate("/app/2fa", { state: { username } });
        return;
      }

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
