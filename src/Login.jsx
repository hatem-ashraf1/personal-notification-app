import { useNavigate } from "react-router-dom";
import { messaging } from "./firebase";
import { getToken } from "firebase/messaging";
import { subscribeToTopic } from "./fcmHelper";

export function Login({ username, setUsername }) {
  const navigate = useNavigate();

  async function handleOnSubmit(e) {
    e.preventDefault();

    if (!username || !username.trim()) return;

    try {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || "BOIpzGAZEj9P1Il5IygJ5LerbduoHqFlhtlZ18GksOcr44YrdJ39xbCjuK7jDzdJWtdpltrbi2t9BgGz4f9Xbwo"
        });

        console.log("🔑 VAPID key used:", !!(import.meta.env.VITE_FIREBASE_VAPID_KEY));

        if (token) {
          console.log("FCM Token:", token);

          // SAVE TOKEN LOCALLY (important)
          localStorage.setItem("fcm_token", token);

          //  REAL TOPIC SUBSCRIPTION
          const normalizedUsername = username.toLowerCase().replaceAll(" ", "").trim();
          const topic = `user_${normalizedUsername}`;

          await subscribeToTopic(token, topic);
          localStorage.setItem("fcm_topic", topic);
        } else {
          console.warn("No token received");
        }
      } else {
        console.warn("Permission denied");
      }

      navigate("/inbox");

    } catch (error) {
      console.error("Login error:", error);
    }
  }

  return (
    <form className="login-container" onSubmit={handleOnSubmit}>
      <input
        type="text"
        placeholder="Username"
        className="username-input"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button type="submit" className="login-button">Login</button>
    </form>
  );
}