import { useNavigate } from "react-router-dom";
import { messaging } from "./firebase";
import { getToken } from "firebase/messaging";

export function Login({ username, setUsername }) {
  const navigate = useNavigate();

  async function handleOnSubmit(e) {
    e.preventDefault();

    if (!username || !username.trim()) return;

    try {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: "BIUp3q-F-yAOvA93vtUQXv_8ljspblXNbiCwLWYr5r-lvMkH39KAdy9LcVZskTv1GSdWWpQb-SAsy0fHFZXd7fw"
        });

        if (token) {
          console.log("FCM Token:", token);

          // ✅ SAVE TOKEN LOCALLY (important)
          localStorage.setItem("fcm_token", token);
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