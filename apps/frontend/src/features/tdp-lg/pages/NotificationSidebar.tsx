// trial file
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

interface Notification {
  id: string;
  message: string;
  createdAt: string;
}

const NotificationSidebar: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const socket = io("http://localhost:3000", {
      transports: ["websocket"],
      query: { token },
    });

    socket.on("notification", (data: Notification) => {
      console.log("New notification received:", data);
      toast.success(data.message);
      setNotifications((prev) => [{ ...data, createdAt: new Date().toISOString() }, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ width: "250px", padding: "1rem", background: "#f9f9f9" }}>
      <h3>Notifications</h3>
      {notifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        <ul>
          {notifications.map((notif) => (
            <li key={notif.id}>{notif.message}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationSidebar;
