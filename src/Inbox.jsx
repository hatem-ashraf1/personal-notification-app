import { useState, useEffect } from "react";
import { db, messaging } from "./firebase";
import { ref, onValue, push, set } from "firebase/database";
import { onMessage } from "firebase/messaging";
import { useNavigate } from "react-router-dom";

function Inbox({ username, setUsername }) {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUsername("");
    navigate("/");
  };

  useEffect(() => {
    if (!username) return;

    const cleanName = username.toLowerCase().replaceAll(" ", "").trim();
    const finalNodeName = `user_${cleanName}`;
    const inboxRef = ref(db, `notifications/${finalNodeName}`);

    const stopListening = onValue(inboxRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const arr = Object.keys(data).map((key) => ({
          id: key,
          ...data[key]
        }));
        arr.sort((a, b) => b.timestamp - a.timestamp);
        setNotifications(arr);
      } else {
        setNotifications([]);
      }
    });

    const unsubscribeFCM = onMessage(messaging, (payload) => {
      console.log("Foreground message:", payload);
      alert(`${payload.notification?.title} - ${payload.notification?.body}`);
      const newRef = push(inboxRef);
      set(newRef, {
        title: payload.notification?.title || "No title",
        body: payload.notification?.body || "No body",
        timestamp: Date.now()
      });
    });

    return () => {
      stopListening();
      unsubscribeFCM();
    };
  }, [username]);

  return (
    <div className="inbox-container">
      <div className="inbox-header">
        <h2>Welcome, {username}!</h2>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="notification-list">
        {notifications.length === 0 ? (
          <p className="empty-inbox">You have no messages right now.</p>
        ) : (
          notifications.map((note) => (
            <div key={note.id} className="notification-card">
              <h3>{note.title}</h3>
              <p>{note.body}</p>
              <small>{new Date(note.timestamp).toLocaleString()}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Inbox;