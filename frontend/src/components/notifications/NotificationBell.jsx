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
        setUnreadCount(0); // reset badge
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
                        notifications.slice(0, 5).map((notif, idx) => (
                            <div className="notif-item" key={idx}>
                                <strong>{notif.title}</strong>
                                <p>{notif.content}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
