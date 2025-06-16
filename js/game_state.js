// game_state.js
const STORAGE_KEY = 'cricket_match_data';
const EXPIRY_DAYS = 3;

const GameState = {
  data: {
    teams: ["Team A", "Team B"],
    innings: 1,
    oversPerInnings: 2,
    currentOver: [],
    balls: 0,
    maxBalls: 12, // 2 overs * 6 balls
    score: [0, 0],
    wickets: [0, 0],
    batsmen: [[], []], // Each innings
    bowlers: [[], []],
    striker: null,
    nonStriker: null,
    currentBowler: null,
    overs: [[], []],
    summary: [],
    winner: null,
    lastAction: null,
    createdAt: Date.now()
  },

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  },

  load() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const age = (Date.now() - parsed.createdAt) / (1000 * 60 * 60 * 24);
      if (age <= EXPIRY_DAYS) {
        this.data = parsed;
      } else {
        this.clear();
      }
    }
  },

  clear() {
    localStorage.removeItem(STORAGE_KEY);
    this.data = {
      ...this.data,
      createdAt: Date.now()
    };
  }
};

GameState.load();

export let gameState = {
    striker: null,
    nonStriker: null,
    batsmenStats: {},
    overs: [],
    isFirstInnings: true,
    targetScore: 0,
    team1: '',
    team2: '',
    matchStartedAt: new Date().getTime()
  };