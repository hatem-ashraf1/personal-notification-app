// FCM Helper Functions - Using Firebase Admin SDK via Backend API

const API_BASE_URL = 'http://localhost:3001/api/fcm';

/**
 * Subscribe FCM token to a topic using Firebase Admin SDK (via backend)
 * @param {string} token - FCM token
 * @param {string} topic - Topic name
 */
export async function subscribeToTopic(token, topic) {
  try {
    const response = await fetch(`${API_BASE_URL}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, topic })
    });

    const data = await response.json();

    if (response.ok) {
      console.log(' Admin SDK subscription successful:', topic, data);
      localStorage.setItem(`fcm_topic_${topic}`, token);
    } else {
      throw new Error(data.error || `HTTP ${response.status}`);
    }
  } catch (error) {
    console.error(' Failed to subscribe to topic:', error);
  }
}

/**
 * Unsubscribe FCM token from a topic using Firebase Admin SDK (via backend)
 * @param {string} token - FCM token
 * @param {string} topic - Topic name
 */
export async function unsubscribeFromTopic(token, topic) {
  try {
    const response = await fetch(`${API_BASE_URL}/unsubscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, topic })
    });

    const data = await response.json();

    if (response.ok) {
      console.log(' Admin SDK unsubscription successful:', topic, data);
      localStorage.removeItem(`fcm_topic_${topic}`);
    } else {
      throw new Error(data.error || `HTTP ${response.status}`);
    }
  } catch (error) {
    console.error(' Failed to unsubscribe from topic:', error);
  }
}

/**
 * Get all subscribed topics for this device
 * @returns {string[]} Array of topic names
 */
export function getSubscribedTopics() {
  const topics = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('fcm_topic_')) {
      topics.push(key.replace('fcm_topic_', ''));
    }
  }
  return topics;
}
