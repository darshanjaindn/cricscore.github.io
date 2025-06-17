// game_state.js
const STORAGE_KEY = 'cricketApp.matchState';
const EXPIRY_KEY = 'cricketApp.expiry';

const GameState = {
  save(state) {
    const now = new Date();
    const expiryDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days from now

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    localStorage.setItem(EXPIRY_KEY, expiryDate.toISOString());
  },

  load() {
    const expiry = localStorage.getItem(EXPIRY_KEY);
    const now = new Date();

    if (expiry && new Date(expiry) < now) {
      console.log("Match data expired. Clearing saved state.");
      this.clear();
      return null;
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse saved match state:", e);
      this.clear();
      return null;
    }
  },

  clear() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(EXPIRY_KEY);
  },

  exists() {
    return !!localStorage.getItem(STORAGE_KEY);
  }
};