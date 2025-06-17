const GameState = (() => {
    const STORAGE_KEY = "cricketApp_currentMatch";
    const MATCH_HISTORY_KEY = "cricket_match_history";
  
    let state = {
      matchInfo: {
        teamA: "Team A",
        teamB: "Team B",
      },
      striker: "",
      nonStriker: "",
      bowler: "",
      onStrike: "striker",
      totalOvers: 5,
      oversBowled: 0,
      ballsInCurrentOver: 0,
      totalRuns: 0,
      wickets: 0,
      currentOver: [],
      history: [],
      bowlerEconomy: {},
      innings: 1,
    };
  
    function save() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  
    function load() {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) state = JSON.parse(data);
      return state;
    }
  
    function abandonMatch() {
      localStorage.removeItem(STORAGE_KEY);
    }
  
    function endCurrentInnings() {
      state.innings += 1;
      state.oversBowled = 0;
      state.ballsInCurrentOver = 0;
      state.currentOver = [];
      state.striker = "";
      state.nonStriker = "";
      state.bowler = "";
      state.onStrike = "striker";
      save();
    }
  
    return { save, load, abandonMatch, endCurrentInnings, get state() { return state; } };
  })();