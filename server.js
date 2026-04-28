import express from 'express';
import admin from 'firebase-admin';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK
const serviceAccountPath = path.resolve(__dirname, 'firebase-service-account.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error(' Missing firebase-service-account.json in project root.');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://cloud-assignment1-f5648-default-rtdb.europe-west1.firebasedatabase.app' // ← UPDATE THIS with your database URL
});

// Subscribe to topic
app.post('/api/fcm/subscribe', async (req, res) => {
  const { token, topic } = req.body;
  try {
    await admin.messaging().subscribeToTopic([token], topic);
    res.json({ success: true, message: `Subscribed to ${topic}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unsubscribe from topic
app.post('/api/fcm/unsubscribe', async (req, res) => {
  const { token, topic } = req.body;
  try {
    await admin.messaging().unsubscribeFromTopic([token], topic);
    res.json({ success: true, message: `Unsubscribed from ${topic}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const DEFAULT_PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      const nextPort = port + 1;
      console.warn(`Port ${port} in use, trying ${nextPort}...`);
      startServer(nextPort);
    } else {
      console.error('Server error:', error);
      process.exit(1);
    }
  });
}

startServer(DEFAULT_PORT);