importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-database-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyByYEEpQET-PWdqwJcldKB8aakWHY4jpQw",
  authDomain: "notification-system-2f7f7.firebaseapp.com",
  projectId: "notification-system-2f7f7",
  storageBucket: "notification-system-2f7f7.firebasestorage.app",
  messagingSenderId: "778055649610",
  appId: "1:778055649610:web:3cf0b06658b98e118499b3",
  databaseURL: "https://notification-system-2f7f7-default-rtdb.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);

self.addEventListener("push", function (event) {
  console.log("Push received:", event);

  if (!event.data) return;

  const payload = event.data.json();
  console.log("Payload:", payload);

  const title = payload.notification?.title || "No title";
  const body = payload.notification?.body || "No body";
  const dynamicUser = payload.data?.target_user || "unknown_user";
  const db = firebase.database();
  db.ref(`notifications/${dynamicUser}`).push({
    title: title,
    body: body,
    timestamp: Date.now()
  });
  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: "/vite.svg"
    })
  );
});