// src/components/NotificationBell.jsx

import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { FaBell } from "react-icons/fa";
import "./NotificationBell.css";

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.warn("No token found, skipping WS connection");
            return;
        }

        // 1) Extragem username din JWT (presupunem că e un token JWT standard)
        let username;
        try {
            const payload = JSON.parse(atob(token.split(".")[1])); // decodăm partea middle a JWT
            username = payload.sub; // în mod normal „sub” conține username-ul
        } catch (err) {
            console.error("Invalid token format:", err);
            return;
        }

        // 2) Funcție pentru a încărca notificările inițiale (REST)
        const fetchInitial = async () => {
            try {
                const res = await fetch("/notifications/unread", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    console.warn("No notifications (status: " + res.status + ")");
                    setNotifications([]);
                    setUnreadCount(0);
                    return;
                }

                const contentType = res.headers.get("content-type") || "";
                if (!contentType.includes("application/json")) {
                    console.warn("No JSON response for unread notifications");
                    setNotifications([]);
                    setUnreadCount(0);
                    return;
                }

                const data = await res.json();
                setNotifications(Array.isArray(data) ? data : []);
                setUnreadCount(Array.isArray(data) ? data.length : 0);
            } catch (err) {
                console.warn("Could not load notifications:", err);
                setNotifications([]);
                setUnreadCount(0);
            }
        };

        fetchInitial();

        // 3) Creăm conexiunea SockJS + STOMP
        const socket = new SockJS("/ws"); // `/ws` e endpoint-ul definit în WebSocketConfig
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,      // încercare reconectare la 5s dacă se închide
            heartbeatIncoming: 10000,  // așteaptă 10s de la server heartbeat
            heartbeatOutgoing: 10000,  // trimite 10s heartbeat către server
            connectHeaders: {
                Authorization: `Bearer ${token}`, // trimitem JWT în header la CONNECT
            },
            onConnect: () => {
                // 4) Ne abonăm pe canalul /user/{username}/queue/notifications
                stompClient.subscribe(
                    `/user/${username}/queue/notifications`,
                    (message) => {
                        try {
                            const notif = JSON.parse(message.body);
                            setNotifications((prev) => [notif, ...prev]);
                            setUnreadCount((prev) => prev + 1);
                        } catch (e) {
                            console.error("Could not parse notification:", e);
                        }
                    }
                );
            },
            onStompError: (frame) => {
                console.error("STOMP error:", frame.headers["message"], frame.body);
            },
        });

        stompClient.activate();

        // 5) Curățăm la demontare
        return () => {
            stompClient.deactivate();
        };
    }, []);

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    const handleMarkAsRead = (id) => {
        fetch(`/notifications/${id}/read`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    console.error(`Failed to mark notification ${id} as read (status ${res.status})`);
                    return;
                }
                setNotifications((prev) =>
                    prev.map((n) => (n.id === id ? { ...n, read: true } : n))
                );
                setUnreadCount((prev) => Math.max(prev - 1, 0));
            })
            .catch((err) =>
                console.error(`❌ Error marking notification ${id} as read:`, err)
            );
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
                                className={`notif-item ${notif.read ? "read" : ""}`}
                                key={notif.id}
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
