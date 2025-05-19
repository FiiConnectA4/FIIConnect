import { useState } from "react";
import axios from "axios";
import "../../styles/CreateAccount.css";

export default function CreateAccount() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email,    setEmail]    = useState("");
    const [role,     setRole]     = useState("");
    const [msg,      setMsg]      = useState("");

    const token = localStorage.getItem("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg("");
        try {
            await axios.post(
                "http://localhost:34101/users/register",
                { username, password, email, role },
                { headers: { "Content-Type": "application/json",
                        // only add the Authorization header if we actually have a token
                        ...(token && { Authorization: `Bearer ${token}` })
                    }, }
            );
            setMsg("✅ User creat cu succes!");
            setUsername("");
            setPassword("");
            setEmail("");
            setRole("");
        } catch (err) {
            console.error(err);
            setMsg(
                "❌ " +
                (err.response?.data?.message || "Eroare la crearea user-ului.")
            );
        }
    };

    const isSuccess = msg.startsWith("✅");
    const isError   = msg.startsWith("❌");

    return (
        <div className="create-page">
            <div className="create-card">
                <h1 className="create-title">Create Account</h1>

                {msg && (
                    <div
                        className={
                            `message ` +
                            (isSuccess ? "success" : isError ? "error" : "")
                        }
                    >
                        {msg}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            className="form-control"
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            className="form-control"
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            className="form-control"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <select
                            id="role"
                            className="form-control"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="" disabled>
                                -- Select a role --
                            </option>
                            <option value="Student">Student</option>
                            <option value="Professor">Professor</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="btn-create"
                        disabled={!role}
                    >
                        Create Account
                    </button>
                </form>
            </div>
        </div>
    );
}