import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // logic for authentication here
    // after successful login:
    navigate("/app/dashboard");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Login</h1>
      <button onClick={handleLogin}>Autentifică-te</button>
    </div>
  );
};

export default Login;