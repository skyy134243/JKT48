// Firebase Client Configuration & Adapter for JKT48 Live Radar
// Supports Firebase v10 Modular SDK via CDN or fallback local emulator

export const firebaseConfig = {
  apiKey: window.__FIREBASE_API_KEY || "AIzaSyDemoRadarKeyJKT48Live",
  authDomain: window.__FIREBASE_AUTH_DOMAIN || "jkt48-live-radar.firebaseapp.com",
  projectId: window.__FIREBASE_PROJECT_ID || "jkt48-live-radar",
  storageBucket: window.__FIREBASE_STORAGE_BUCKET || "jkt48-live-radar.appspot.com",
  messagingSenderId: window.__FIREBASE_SENDER_ID || "1029384756",
  appId: window.__FIREBASE_APP_ID || "1:1029384756:web:abcdef123456"
};

export const hasLiveFirebaseConfig = () => {
  return window.__FIREBASE_API_KEY && window.__FIREBASE_API_KEY !== "AIzaSyDemoRadarKeyJKT48Live";
};
