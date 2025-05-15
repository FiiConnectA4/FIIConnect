import { useNavigate } from "react-router-dom";
import "./LogoutButton.css";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Trimite cererea de logout către backend
        await fetch("http://localhost:34101/users/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Eroare la logout:", error);
      }
    }

    // Șterge tokenul local și redirecționează către pagina de login
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
      <button className="logout-button" onClick={handleLogout}> 🔓 Logout </button>
  );
}

export default LogoutButton;
