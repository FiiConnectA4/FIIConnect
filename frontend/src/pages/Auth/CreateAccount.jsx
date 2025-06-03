import { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/CreateAccount.css";

export default function CreateAccount() {
    const [unassigned, setUnassigned] = useState([]);
    const [selected, setSelected] = useState([]);
    const [msg, setMsg] = useState("");
    const token = localStorage.getItem("token");

    const fetchUnassigned = async () => {
        try {
            const { data } = await axios.get(
                "http://localhost:34101/person/unassigned",
                { headers: token ? { Authorization: `Bearer ${token}` } : {} }
            );
            setUnassigned(data);
            setSelected([]); // curăță selecția când reîncarci lista
        } catch (err) {
            console.error("Error fetching unassigned:", err);
        }
    };

    useEffect(() => {
        fetchUnassigned();
        }, []);


    const toggleSelect = (item) => {
        const key = `${item.role}-${item.entityId}`;
        setSelected((prev) => {
            const exists = prev.find((x) => `${x.role}-${x.entityId}` === key);
            if (exists) return prev.filter((x) => `${x.role}-${x.entityId}` !== key);
            return [...prev, item];
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg("");

        if (!selected.length) {
            setMsg("❌ Nicio persoană selectată.");
            return;
        }

        // construiește payload-ul: un array de obiecte user
        const usersToCreate = selected.map((item) => {
            const uname = `${item.firstName.toLowerCase()}.${item.lastName.toLowerCase()}.${item.entityId}`;
            const userObj = {
                username: uname,
                email: `${uname}@fiiconnect.com`,
                password: "Test123!",
                role: item.role,
            };
            if (item.role === "STUDENT") userObj.studentId = item.entityId;
            else userObj.professorId = item.entityId;
            return userObj;
        });

        try {
            await axios.post(
                "http://localhost:34101/users/register-multiple",
                usersToCreate,
                {
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                }
            );
            setMsg(`✅ Au fost create ${usersToCreate.length} conturi.`);
            setSelected([]);
            fetchUnassigned();
        } catch (err) {
            console.error(err);
            setMsg(
                "❌ " +
                (err.response?.data?.message || "Eroare la crearea conturilor.")
            );
        }
    };

    const isSuccess = msg.startsWith("✅");
    const isError = msg.startsWith("❌");

    return (
        <div className="create-page">
            <div className="create-card">
                <h1 className="create-title">Create Accounts in Bulk</h1>

                {msg && (
                    <div
                        className={`message ${
                            isSuccess ? "success" : isError ? "error" : ""
                        }`}
                    >
                        {msg}
                    </div>
                )}

                <button onClick={fetchUnassigned} className="btn-refresh">
                    Refresh
                </button>

                <div className="unassigned-container">
                    <h2>Conturi disponibile</h2>
                    <table className="unassigned-table">
                        <thead>
                        <tr>
                            <th></th>
                            <th>Entity ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Role</th>
                        </tr>
                        </thead>
                        <tbody>
                        {unassigned.map((item) => {
                            const key = `${item.role}-${item.entityId}`;
                            const checked = selected.some(
                                (x) => `${x.role}-${x.entityId}` === key
                            );
                            return (
                                <tr key={key}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => toggleSelect(item)}
                                        />
                                    </td>
                                    <td>{item.entityId}</td>
                                    <td>{item.firstName}</td>
                                    <td>{item.lastName}</td>
                                    <td>{item.role}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>

                <form onSubmit={handleSubmit}>
                    <button
                        type="submit"
                        className="btn-create"
                        disabled={!selected.length}
                    >
                        Create {selected.length} Account
                        {selected.length > 1 ? "s" : ""}
                    </button>
                </form>
            </div>
        </div>
    );
}