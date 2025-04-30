import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // ✅ Dacă există token, redirect automat la dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/app/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:34101/users/login", {
        username,
        password
      });

      const token = response.data.token;
      localStorage.setItem("token", token);
      console.log("Token salvat:", token);

      navigate("/app/dashboard");
    } catch (error) {
      console.error("Eroare la login:", error);
      alert("Login eșuat. Verifică username-ul și parola!");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br /><br />
        <input
          type="password"
          placeholder="Parola"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />
        <button type="submit">Autentifică-te</button>
      </form>
    </div>
  );
};

export default Login;
