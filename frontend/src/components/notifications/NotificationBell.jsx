// src/components/NotificationBell.jsx

import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { FaBell } from "react-icons/fa";
import "./NotificationBell.css";

const BACKEND_URL = "http://localhost:34101"; // Adresa Spring Boot

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.warn("Nu există token, nu se deschide WS");
            return;
        }

        // Extragem username din JWT (presupunem că îl avem în "sub")
        let username;
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            username = payload.sub;
        } catch (err) {
            console.error("Format JWT invalid:", err);
            return;
        }

        // 1) Obținem notificările inițiale prin REST
        const fetchInitial = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/notifications/unread`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("[NotificationBell] fetch /notifications/unread, status:", res.status);
                if (!res.ok) {
                    setNotifications([]);
                    setUnreadCount(0);
                    return;
                }
                const data = await res.json();
                setNotifications(Array.isArray(data) ? data : []);
                setUnreadCount(Array.isArray(data) ? data.length : 0);
            } catch (err) {
                console.warn("Nu s-au putut încărca notificările:", err);
                setNotifications([]);
                setUnreadCount(0);
            }
        };
        fetchInitial();

        // 2) Deschidem conexiunea SockJS + STOMP la BACKEND_URL/ws
        const sockJsEndpoint = `${BACKEND_URL}/ws`; // atenție: full URL, nu relativ
        const socket = new SockJS(sockJsEndpoint);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,      // încearcă reconectare la 5s
            heartbeatIncoming: 10000,  // așteaptă heartbeat de la server
            heartbeatOutgoing: 10000,  // trimite heartbeat către server
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            onStompError: (frame) => {
                console.error("[STOMP] Broker error:", frame.headers["message"], frame.body);
            },
            onConnect: () => {
                console.log("[STOMP] Conexiune deschisă, subscribe pe /user/" + username + "/queue/notifications");
                // 3) Mă abonăm pe canalul user‐specific
                stompClient.subscribe(`/user/${username}/queue/notifications`, (message) => {
                    console.log("[STOMP] Mesaj recepționat:", message.body);
                    try {
                        const notif = JSON.parse(message.body);
                        setNotifications((prev) => [notif, ...prev]);
                        setUnreadCount((prev) => prev + 1);
                    } catch (e) {
                        console.error("Nu s-a putut parsa notificarea:", e);
                    }
                });
            },
        });

        stompClient.activate();

        // 4) Cleanup la demontare
        return () => {
            console.log("[STOMP] Deactivare STOMP client");
            stompClient.deactivate();
        };
    }, []);

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    const handleMarkAsRead = (id) => {
        fetch(`${BACKEND_URL}/notifications/${id}/read`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    console.error(`Eșec la marcarea notificării ${id} ca citită (status ${res.status})`);
                    return;
                }
                setNotifications((prev) =>
                    prev.map((n) => (n.id === id ? { ...n, read: true } : n))
                );
                setUnreadCount((prev) => Math.max(prev - 1, 0));
            })
            .catch((err) => console.error(`Eroare la PUT /notifications/${id}/read:`, err));
    };

    return (
        <div className="notification-bell">
            <div className="icon" onClick={toggleDropdown}>
                <div className="icon-bg">
                    <FaBell size={20} color="white" />
                </div>
                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </div>

            {dropdownOpen && (
                <div className="dropdown">
                    {notifications.length === 0 ? (
                        <div className="empty">Fără notificări</div>
                    ) : (
                        notifications.slice(0, 10).map((notif) => (
                            <div
                                key={notif.id}
                                className={`notif-item ${notif.read ? "read" : ""}`}
                            >
                                <div className="notif-header">
                                    <strong>{notif.title}</strong>
                                    <span className="notif-timestamp">
                    {new Date(notif.timestamp).toLocaleString("ro-RO", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                  </span>
                                </div>
                                <p>{notif.content}</p>
                                {!notif.read && (
                                    <button
                                        className="mark-read-btn"
                                        onClick={() => handleMarkAsRead(notif.id)}
                                    >
                                        Mark as read ✔️
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
