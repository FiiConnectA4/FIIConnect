import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import "./NotificationBell.css";

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem("token");

        // 1. WebSocket connection
        const socket = new SockJS(`/ws?token=${token}`);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("✅ Connected to WebSocket");

                stompClient.subscribe("/user/queue/notifications", (message) => {
                    const notif = JSON.parse(message.body);
                    console.log("📩 WebSocket notification:", notif);
                    setNotifications((prev) => [notif, ...prev]);
                    setUnreadCount((prev) => prev + 1);
                });
            },
        });
        stompClient.activate();

        // 2. Initial fetch of unread notifications
        fetch("/notifications/unread", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch notifications");
                return res.json();
            })
            .then(data => {
                console.log("📦 Initial unread notifications:", data);
                setNotifications(data);
                setUnreadCount(data.length);
            })
            .catch(err => console.error("❌ Notification fetch error:", err));

        return () => {
            stompClient.deactivate();
        };
    }, []);


    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleMarkAsRead = (id) => {
        fetch(`/notifications/${id}/read`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then(() => {
                setNotifications((prev) =>
                    prev.map((n) =>
                        n.id === id ? { ...n, read: true } : n
                    )
                );
                setUnreadCount((prev) => Math.max(prev - 1, 0));
            })
            .catch((err) =>
                console.error(`❌ Eroare la marcarea notificării ${id} ca citită`, err)
            );
    };



    return (
        <div className="notification-bell">
            <div className="icon" onClick={toggleDropdown}>
                🔔
                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </div>

            {dropdownOpen && (
                <div className="dropdown">
                    {notifications.length === 0 ? (
                        <div className="empty">Fără notificări</div>
                    ) : (
                        notifications.slice(0, 10).map((notif) => (
                            <div className={`notif-item ${notif.read ? "read" : ""}`} key={notif.id}>

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
