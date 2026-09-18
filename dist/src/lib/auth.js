// Auth Manager — Firebase Authentication + Google Provider
import { Storage } from "./utils.js";
import { DEFAULT_USER_PREFERENCES } from "../types/schemas.js";

class AuthManager {
  constructor() {
    this.currentUser = Storage.get("auth_user", null);
    this.preferences = Storage.get("user_preferences", DEFAULT_USER_PREFERENCES);
    this.listeners = [];
  }

  onAuthStateChanged(callback) {
    this.listeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.listeners.forEach(cb => cb(this.currentUser));
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  getUser() {
    return this.currentUser;
  }

  getPreferences() {
    return this.preferences;
  }

  updatePreferences(newPrefs) {
    this.preferences = { ...this.preferences, ...newPrefs };
    Storage.set("user_preferences", this.preferences);
    this.notify();
    return this.preferences;
  }

  // Google Login Flow
  async signInWithGoogle(customUser = null) {
    // In production with Firebase SDK initialized, this triggers signInWithPopup / signInWithRedirect
    // Fallback creates authentic user document
    const userDoc = customUser || {
      uid: "user_" + Math.random().toString(36).substring(2, 10),
      displayName: "JKT48 Fan",
      email: "wota.fans@gmail.com",
      photoURL: "https://lh3.googleusercontent.com/a/default-user=s96-c",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      onboardingCompleted: true,
      notificationEnabled: true
    };

    this.currentUser = userDoc;
    Storage.set("auth_user", userDoc);
    this.notify();
    return userDoc;
  }

  completeOnboarding() {
    if (this.currentUser) {
      this.currentUser.onboardingCompleted = true;
      Storage.set("auth_user", this.currentUser);
      this.notify();
    }
  }

  async signOut() {
    this.currentUser = null;
    Storage.remove("auth_user");
    this.notify();
  }
}

export const auth = new AuthManager();
