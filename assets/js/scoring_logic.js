const teamA = localStorage.getItem("teamA") || "Team A";
const teamB = localStorage.getItem("teamB") || "Team B";

let striker = localStorage.getItem("current_strikerName") || "Striker";
let nonStriker = localStorage.getItem("current_nonStrikerName") || "Non-striker";
let bowler = localStorage.getItem("current_bowlerName") || "Bowler";
let currentInnings = localStorage.getItem("currentInnings") || "innings1";

const tossWinner = localStorage.getItem("tossWinner")
const tossChoice = localStorage.getItem("opted")


if (!tossWinner || !tossChoice) {
  alert("Toss information missing. Please go back and complete team/toss setup.");
  window.location.href = "index.html"; // or wherever toss info is set
  throw new Error("Missing tossWinner or tossChoice in localStorage.");
}


let { battingTeam, bowlingTeam } = getTeamsByInnings(currentInnings, teamA, teamB, tossWinner, tossChoice);

let score = 0, wickets = 0, balls = 0;
let overLog = [];

// Init of batters
let batterStats = {
  [striker]: { runs: 0, balls: 0, fours: 0, sixes: 0 },
  [nonStriker]: { runs: 0, balls: 0, fours: 0, sixes: 0 }
};

// Init of bowlers
let bowlerStats = {
  [bowler]: { balls: 0, runs: 0, wickets: 0 }
};


// Determing Batting & Bowling Team
function getTeamsByInnings(innings, teamA, teamB, tossWinner, tossChoice) {
  if (!innings || !teamA || !teamB || !tossWinner || !tossChoice) {
    throw new Error("Missing parameter in getTeamsByInnings");
  }

  tossChoice = (tossChoice || "").toLowerCase();
  if (innings === "innings1") {
    if (tossChoice === "bat") {
      return {
        battingTeam: tossWinner,
        bowlingTeam: tossWinner === teamA ? teamB : teamA,
      };
    } else if (tossChoice === "bowl") {
      return {
        battingTeam: tossWinner === teamA ? teamB : teamA,
        bowlingTeam: tossWinner,
      };
    } else {
      throw new Error("Invalid toss choice");
    }
  } else if (innings === "innings2") {
    if (tossChoice === "bat") {
      return {
        battingTeam: tossWinner === teamA ? teamB : teamA,
        bowlingTeam: tossWinner,
      };
    } else if (tossChoice === "bowl") {
      return {
        battingTeam: tossWinner,
        bowlingTeam: tossWinner === teamA ? teamB : teamA,
      };
    } else {
      throw new Error("Invalid toss choice");
    }
  } else {
    throw new Error("Invalid innings value");
  }
}

// Update score display
function updateScoreDisplay() {
  const overs = Math.floor(balls / 6);
  const currentBall = balls % 6;
  const crr = (balls > 0) ? (score / (balls / 6)).toFixed(2) : "0.00";

  // Display match title (fixed teams)
  document.getElementById("matchTitle").innerText = `${teamA} vs ${teamB}`;

  // Decide batting team based on current innings
  document.getElementById("scoreDisplay").innerText = `${battingTeam} Batting, ${score}-${wickets} (${overs}.${currentBall})`;
  document.getElementById("crrDisplay").innerText = `CRR: ${crr}`;

  // Ensure batterStats entries exist before accessing
  if (!batterStats[striker]) {
    batterStats[striker] = { runs: 0, balls: 0, fours: 0, sixes: 0 };
  }
  if (!batterStats[nonStriker]) {
    batterStats[nonStriker] = { runs: 0, balls: 0, fours: 0, sixes: 0 };
  }

  // Update striker info
  document.getElementById("strikerName").innerText = striker + "*";
  document.getElementById("strikerRuns").innerText = batterStats[striker].runs;
  document.getElementById("strikerBalls").innerText = batterStats[striker].balls;
  document.getElementById("striker4").innerText = batterStats[striker].fours;
  document.getElementById("striker6").innerText = batterStats[striker].sixes;
  document.getElementById("strikerSR").innerText = calculateSR(batterStats[striker]);

  // Update non-striker info
  document.getElementById("nonStrikerName").innerText = nonStriker;
  document.getElementById("nonStrikerRuns").innerText = batterStats[nonStriker].runs;
  document.getElementById("nonStrikerBalls").innerText = batterStats[nonStriker].balls;
  document.getElementById("nonStriker4").innerText = batterStats[nonStriker].fours;
  document.getElementById("nonStriker6").innerText = batterStats[nonStriker].sixes;
  document.getElementById("nonStrikerSR").innerText = calculateSR(batterStats[nonStriker]);

  // Ensure bowlerStats entry exists before accessing
  if (!bowlerStats[bowler]) {
    bowlerStats[bowler] = { balls: 0, runs: 0, wickets: 0 };
  }

  // Update bowler info
  const b = bowlerStats[bowler];
  const bowlerOvers = `${Math.floor(b.balls / 6)}.${b.balls % 6}`;
  const bowlerER = b.balls > 0 ? (b.runs / (b.balls / 6)).toFixed(2) : "0.00";

  document.getElementById("bowlerName").innerText = bowler;
  document.getElementById("bowlerOvers").innerText = bowlerOvers;
  document.getElementById("bowlerRuns").innerText = b.runs;
  document.getElementById("bowlerWickets").innerText = b.wickets;
  document.getElementById("bowlerER").innerText = bowlerER;

  // Over log display, with classes for styling
  document.getElementById("overLog").innerHTML = `<strong>This over:</strong> ${overLog.map(ball => {
    let className = "default-ball"; // normal runs
    if (ball.startsWith("wk")) className = "wicket-ball";
    else if (ball.startsWith("wd") || ball.startsWith("nb") || ball.startsWith("b") || ball.startsWith("lb")) className = "extra-ball";
    else if (ball === "4" || ball === "6") className = "boundary-ball";

    return `<span class="${className}">${ball}</span>`;
  }).join(" ")}`;
}

// Calculate Strike Rate
function calculateSR(batter) {
  return batter.balls > 0 ? ((batter.runs / batter.balls) * 100).toFixed(2) : "0.00";
}

// Scoring Logic
function scoreRun(runs) {
  const wide = document.getElementById("wide").checked;
  const noBall = document.getElementById("noBall").checked;
  const wicket = document.getElementById("wicket").checked;
  const byes = document.getElementById("byes")?.checked;
  const legByes = document.getElementById("legByes")?.checked;

  const isExtra = wide || noBall || byes || legByes;
  const ballCounted = !wide && !noBall;
  let runText = runs.toString();

  // Format over log text
  if (wide) runText = `wd+${runs}`;
  else if (noBall) runText = `nb+${runs}`;
  else if (byes) runText = `b+${runs}`;
  else if (legByes) runText = `lb+${runs}`;
  else if (wicket) runText = runs > 0 ? `wk+${runs}` : `wk`;

  // Calculate legal balls including this ball
  // We add this ball’s log *after* all updates, so count + 1 for current ball
  const legalBallsInOver = overLog.filter(log => !log.startsWith("wd") && !log.startsWith("nb")).length + (ballCounted ? 1 : 0);

  // ===== WICKET CASE =====
  if (wicket) {
    wickets++;
    score += runs;
    if (!wide && !noBall) {
      batterStats[striker].balls++;
      bowlerStats[bowler].balls++;
    }
    bowlerStats[bowler].runs += runs;
    bowlerStats[bowler].wickets++;
    if (!wide && !noBall && !byes && !legByes) {
      batterStats[striker].runs += runs;
      if (runs === 4) batterStats[striker].fours++;
      if (runs === 6) batterStats[striker].sixes++;
    }
    if (!wide && !noBall) balls++;
    overLog.push(runText);
    saveInningsToLocalStorage();
    persistMatchState();

    const totalOvers = parseInt(localStorage.getItem("overs"), 10);
    const maxBalls = totalOvers * 6;

    // 🏁 First check: Did the innings end?
    if (balls >= maxBalls || wickets >= 10) {
      localStorage.setItem("inningsCompleted", "1");
      startSecondInnings(); // only first→second transition
      matchEnded = true;    // if using that flag
      window.location.href = "player_setup.html";
      return;
    }

    // 🛑 Next: Did this fall on the last legal ball of the over?
    const legalBallsInOver = overLog.filter(log => !log.startsWith("wd") && !log.startsWith("nb")).length;
    if (legalBallsInOver === 6) {
      localStorage.setItem("overCompletedAfterWicket", "true");
      localStorage.setItem("newOverStarted", "true");
      overLog = [];
      saveInningsToLocalStorage();
      persistMatchState();
      window.location.href = "next_batsmen.html";
      return;
    }

    // ✅ Otherwise, normal wicket handling
    localStorage.setItem("lastOverStriker", striker);
    localStorage.setItem("lastOverNonStriker", nonStriker);
    window.location.href = "next_batsmen.html";
    return;
  }

  // ===== EXTRAS CASE =====
  if (isExtra) {
    score += runs + (wide || noBall ? 1 : 0); // Wide or no ball gives 1 extra

    if (wide || noBall) {
      bowlerStats[bowler].runs += runs + 1;
    } else {
      bowlerStats[bowler].runs += runs;
    }

    if (ballCounted) {
      balls++;
      bowlerStats[bowler].balls++;
      persistMatchState();
      checkInningsCompletion()
      saveInningsToLocalStorage();
    }

    overLog.push(runText);
    saveInningsToLocalStorage();

    // Swap strike for odd extras
    if ((byes || legByes || wide || noBall) && runs % 2 === 1) {
      swapBatsman(false);
    }
  }
  // ===== NORMAL RUN CASE =====
  else {
    score += runs;
    batterStats[striker] = batterStats[striker] || { runs: 0, balls: 0, fours: 0, sixes: 0 };
    batterStats[striker].runs += runs;

    if (runs === 4) batterStats[striker].fours++;
    if (runs === 6) batterStats[striker].sixes++;

    if (ballCounted) {
      balls++;
      batterStats[striker].balls++;
      bowlerStats[bowler].balls++;
      persistMatchState();
      checkInningsCompletion();
      saveInningsToLocalStorage();
    }

    bowlerStats[bowler].runs += runs;

    if (runs % 2 === 1) swapBatsman(false);

    overLog.push(runText);
    saveInningsToLocalStorage();
  }

  // ===== OVER COMPLETION CHECK =====
  if (legalBallsInOver === 6) {
    swapBatsman(false);
    localStorage.setItem("lastOverStriker", striker);
    localStorage.setItem("lastOverNonStriker", nonStriker);
    localStorage.setItem("newOverStarted", "true");
    saveInningsToLocalStorage();
    overLog = [];

    persistMatchState();
    
    const inningsEnded = checkInningsCompletion();
    if (!inningsEnded) {
      window.location.href = "next_bowler.html";
    }
    return;
  }

  persistMatchState();
  updateScoreDisplay();

  // Reset checkboxes
  document.querySelectorAll('input[type="checkbox"]').forEach(el => el.checked = false);
}           

// Persist Match Score
function persistMatchState() {
  localStorage.setItem("match_score", score);
  localStorage.setItem("match_wickets", wickets);
  localStorage.setItem("match_balls", balls);
  localStorage.setItem("match_batterStats", JSON.stringify(batterStats));
  localStorage.setItem("match_bowlerStats", JSON.stringify(bowlerStats));
  localStorage.setItem("match_overLog", JSON.stringify(overLog));
}

function loadPersistedMatchState() {
  score = parseInt(localStorage.getItem("match_score")) || 0;
  wickets = parseInt(localStorage.getItem("match_wickets")) || 0;
  balls = parseInt(localStorage.getItem("match_balls")) || 0;
  batterStats = JSON.parse(localStorage.getItem("match_batterStats")) || {};
  bowlerStats = JSON.parse(localStorage.getItem("match_bowlerStats")) || {};

  const isNewOver = localStorage.getItem("newOverStarted") === "true";

  // ✅ Reset over log if it's a new over
  if (isNewOver) {
    overLog = [];
    localStorage.removeItem("newOverStarted");
  } else {
    overLog = JSON.parse(localStorage.getItem("match_overLog")) || [];
  }

  if (!bowlerStats[bowler]) {
    bowlerStats[bowler] = { balls: 0, runs: 0, wickets: 0 };
  }
}    

function swapBatsman(updateUI = true) {
  let temp = striker;
  striker = nonStriker;
  nonStriker = temp;
  localStorage.setItem("strikerName", striker);
  localStorage.setItem("nonStrikerName", nonStriker);
  if (updateUI) updateScoreDisplay();
}

function retireBatsman() {
  alert("Retire logic to be implemented");
}

function undoLastBall() {
  alert("Undo logic to be implemented");
}

function moreOptions() {
  alert("More options to be implemented");
}

function showPartnerships() {
  alert("Partnership details to be implemented");
}

function addExtras() {
  alert("Add extras logic to be implemented");
}

// Save Inning wise data to local Storage
function saveInningsToLocalStorage() {
  if (currentInnings === "innings1") {
    const storageKey = "matchData1";
    let innings1Data = JSON.parse(localStorage.getItem(storageKey)) || {};

    const battingTeam = localStorage.getItem("battingTeam");
    const bowlingTeam = localStorage.getItem("bowlingTeam");
    if (!battingTeam || !bowlingTeam) {
      console.error("❗ Missing battingTeam or bowlingTeam");
      return;
    }

    innings1Data[battingTeam] = innings1Data[battingTeam] || {};
    innings1Data[bowlingTeam] = innings1Data[bowlingTeam] || {};

    // --- Batter Stats ---
    const batterOrder = JSON.parse(localStorage.getItem("batterOrder") || "[]");
    const batters = batterOrder.length > 0 ? batterOrder : [striker, nonStriker];
    const batterKeys = {};
    Object.entries(innings1Data[battingTeam]).forEach(([key, val]) => {
      if (key.startsWith("batsmen") && val.name) {
        batterKeys[val.name] = key;
      }
    });
    batters.forEach(name => {
      if (!name) return;
      const stats = batterStats[name] || { runs: 0, balls: 0, fours: 0, sixes: 0 };
      let key = batterKeys[name];
      if (!key) {
        key = "batsmen" + (Object.keys(batterKeys).length + 1);
        batterKeys[name] = key;
      }
      innings1Data[battingTeam][key] = {
        name,
        score: stats.runs,
        balls: stats.balls,
        "4s": stats.fours,
        "6s": stats.sixes,
        SR: calculateSR(stats)
      };
    });

    // --- Bowler Stats ---
    const statsBow = bowlerStats[bowler] || { balls: 0, runs: 0, wickets: 0 };
    const existingBowlerEntries = Object.entries(innings1Data[bowlingTeam]).filter(([k]) => k.startsWith("bowler"));
    let bKey = existingBowlerEntries.find(([_, v]) => v.name === bowler)?.[0];
    if (!bKey) {
      bKey = "bowler" + (existingBowlerEntries.length + 1);
    }
    const overs = `${Math.floor(statsBow.balls / 6)}.${statsBow.balls % 6}`;
    innings1Data[bowlingTeam][bKey] = {
      name: bowler,
      overs,
      Maidens: "",
      Runs: statsBow.runs,
      Wicket: statsBow.wickets,
      ER: statsBow.balls > 0 ? (statsBow.runs / (statsBow.balls / 6)).toFixed(2) : "0.00"
    };

    localStorage.setItem(storageKey, JSON.stringify(innings1Data));
  }
  else {
    console.log("2nd inning:", currentInnings)
    const storageKey = "matchData2";
    
    // Ensure clean slate for 2nd innings only at the beginning
    const isStartOfInnings2 = Number(localStorage.getItem("match_balls") || 0) === 0;
    console.log("match balls:", localStorage.getItem("match_balls"))
    console.log("Inning1completed?: ", localStorage.getItem("inningsCompleted"))
    secondInningsResetDone = localStorage.getItem("secondInningsStarted") === "true";

    let innings2Data;

    if (!isStartOfInnings2 && secondInningsResetDone) {
      // Continue from existing data
      console.log("📝 Continue from existing data");
      innings2Data = JSON.parse(localStorage.getItem(storageKey)) || {};
    } else {
      // Start fresh
      console.log("🔄 Initializing new data for second innings");
      innings2Data = {};
      localStorage.setItem("matchData2ResetDone", "true");
    }

    const battingTeam = localStorage.getItem("battingTeam");
    const bowlingTeam = localStorage.getItem("bowlingTeam");
    if (!battingTeam || !bowlingTeam) {
      console.error("❗ Missing battingTeam or bowlingTeam");
      return;
    }

    innings2Data[battingTeam] = innings2Data[battingTeam] || {};
    innings2Data[bowlingTeam] = innings2Data[bowlingTeam] || {};

    console.log("i2data: ",innings2Data);
    // --- Batter Stats ---
    const batterOrder = JSON.parse(localStorage.getItem("batterOrder") || "[]");
    const batters = batterOrder.length > 0 ? batterOrder : [striker, nonStriker];
    const batterKeys = {};
    Object.entries(innings2Data[battingTeam]).forEach(([key, val]) => {
      if (key.startsWith("batsmen") && val.name) {
        batterKeys[val.name] = key;
      }
    });

    batters.forEach(name => {
      if (!name) return;
      const stats = batterStats[name] || { runs: 0, balls: 0, fours: 0, sixes: 0 };
      let key = batterKeys[name];
      if (!key) {
        key = "batsmen" + (Object.keys(batterKeys).length + 1);
        batterKeys[name] = key;
      }
      innings2Data[battingTeam][key] = {
        name,
        score: stats.runs,
        balls: stats.balls,
        "4s": stats.fours,
        "6s": stats.sixes,
        SR: calculateSR(stats)
      };
    });

    // --- Bowler Stats ---
    const statsBow = bowlerStats[bowler] || { balls: 0, runs: 0, wickets: 0 };
    const existingBowlerEntries = Object.entries(innings2Data[bowlingTeam]).filter(([k]) => k.startsWith("bowler"));
    let bKey = existingBowlerEntries.find(([_, v]) => v.name === bowler)?.[0];
    if (!bKey) {
      bKey = "bowler" + (existingBowlerEntries.length + 1);
    }
    console.log("existingBowlerEntries:", existingBowlerEntries);
    console.log("bKey: ",bKey);
    const overs = `${Math.floor(statsBow.balls / 6)}.${statsBow.balls % 6}`;
    innings2Data[bowlingTeam][bKey] = {
      name: bowler,
      overs,
      Maidens: "",
      Runs: statsBow.runs,
      Wicket: statsBow.wickets,
      ER: statsBow.balls > 0 ? (statsBow.runs / (statsBow.balls / 6)).toFixed(2) : "0.00"
    };

    localStorage.setItem(storageKey, JSON.stringify(innings2Data));
    }
}

function endFirstInnings() {
  // Saving 1st innings score
  console.log("Ending 1st Innings... Start")
  localStorage.setItem("innings1_score", localStorage.getItem("match_score") || "0");
  localStorage.setItem("innings1_wickets", localStorage.getItem("match_wickets") || "0");
  localStorage.setItem("innings1_ballsFaced", localStorage.getItem("match_balls") || "0");
  const matchData1 = localStorage.getItem("matchData1") || "{}";
  localStorage.setItem("innings1_data", matchData1);
  //
  tempInn = "innings2";
  let { battingTeam, bowlingTeam } = getTeamsByInnings(tempInn, teamA, teamB, tossWinner, tossChoice);
  localStorage.setItem("battingTeam", battingTeam);
  localStorage.setItem("bowlingTeam", bowlingTeam);
  console.log("Ending 1st Innings... End")
}

// Start the second Innings 
function startSecondInnings() {
  console.log("start2ndInnings...")
  
  currentInnings = "innings2";
  localStorage.setItem("currentInnings", currentInnings);
  localStorage.setItem("matchData2ResetDone", "false");
  
  const secondInningsStarted = localStorage.getItem("secondInningsStarted") === "true";
  console.log("🔍 secondInningsStarted flag", secondInningsStarted);
  if (secondInningsStarted) {
    // Already started, load from persisted state
    loadPersistedMatchState();
    updateScoreDisplay();
    return;
  }

  // First time starting second innings — reset everything
  score = 0;
  wickets = 0;
  balls = 0;
  overLog = [];

  batterStats = {};
  striker = localStorage.getItem("current_strikerName") || "Striker";
  nonStriker = localStorage.getItem("current_nonStrikerName") || "Non-Striker";

  batterStats[striker] = { runs: 0, balls: 0, fours: 0, sixes: 0 };
  batterStats[nonStriker] = { runs: 0, balls: 0, fours: 0, sixes: 0 };

  bowlerStats = {};
  bowler = localStorage.getItem("current_bowlerName") || "Bowler";
  bowlerStats[bowler] = { balls: 0, runs: 0, wickets: 0 };

  // Save initial 2nd innings state
  localStorage.setItem("secondInningsStarted", "true");
  localStorage.setItem("match_score", score);
  localStorage.setItem("match_wickets", wickets);
  localStorage.setItem("match_balls", balls);
  localStorage.setItem("match_batterStats", JSON.stringify(batterStats));
  localStorage.setItem("match_bowlerStats", JSON.stringify(bowlerStats));
  localStorage.setItem("match_overLog", JSON.stringify(overLog));
  
  updateScoreDisplay();
}

// Determine Match winner
function determineMatchWinner() {
  const tossWinner = localStorage.getItem("tossWinner");
  const opted = localStorage.getItem("opted"); // "Bat" or "Bowl"
  const teamA = localStorage.getItem("teamA");
  const teamB = localStorage.getItem("teamB");

  const innings1Score = parseInt(localStorage.getItem("innings1_score") || "0", 10);
  const innings2Score = parseInt(localStorage.getItem("innings2_score") || "0", 10);
  const innings2Wickets = parseInt(localStorage.getItem("match_wickets") || "0", 10);
  const wicketsRemaining = 10 - innings2Wickets;

  let battingFirst, battingSecond;

  if (opted === "Bat") {
    battingFirst = tossWinner;
    battingSecond = tossWinner === teamA ? teamB : teamA;
  } else {
    battingSecond = tossWinner;
    battingFirst = tossWinner === teamA ? teamB : teamA;
  }

  let winner = "", howWon = "", margin = "";

  if (innings1Score > innings2Score) {
    winner = battingFirst;
    howWon = "Won by";
    margin = `${innings1Score - innings2Score} Runs`;
  } else if (innings2Score > innings1Score) {
    winner = battingSecond;
    howWon = "Won by";
    margin = `${wicketsRemaining} Wicket${wicketsRemaining === 1 ? "" : "s"}`;
  } else {
    winner = "Match";
    howWon = "";
    margin = "Tied";
  }

  // Save parts to localStorage
  localStorage.setItem("matchWinner", winner);
  localStorage.setItem("matchVictoryType", howWon);
  localStorage.setItem("matchMargin", margin);

  window.location.href = "victory.html";
}

let matchEnded = false; // 🔁 Global flag to avoid multiple redirects

function checkInningsCompletion() {
  if (matchEnded) return true;
  const currentInnings = localStorage.getItem("currentInnings") || "innings1";
  const totalOvers = parseInt(localStorage.getItem("overs"), 10) || 0;
  const maxBalls = totalOvers * 6;
  const targetScore = parseInt(localStorage.getItem("innings1_score"), 10) || 0;

  if (currentInnings === "innings2") {
    // Team B is chasing
    if (score > targetScore) {
      matchEnded = true;
      localStorage.setItem("innings2_score", score.toString());
      determineMatchWinner();
      return true;
    }

    if (balls >= maxBalls || wickets >= 10) {
      matchEnded = true;
      localStorage.setItem("innings2_score", score.toString());
      determineMatchWinner(); // Could be win or loss depending on chase
      return true;
    }
  } else {
    // First innings
    if (balls >= maxBalls || wickets >= 10) {
      matchEnded = true;
      saveInningsToLocalStorage();
      persistMatchState();
      localStorage.setItem("inningsCompleted", "1");

      // Prepare for second innings
      localStorage.setItem("innings1_score", score.toString());
      endFirstInnings();
      window.location.href = "player_setup.html";
      return true;
    }
  }

  return false; // innings continues
}    

window.onload = () => {
  let currentInnings = localStorage.getItem("currentInnings") || "innings1";

  if (currentInnings === "innings2") {
    startSecondInnings();
  } else {
    loadPersistedMatchState();
  }

  // Reload current striker/non-striker names in case changed from next_batsmen.html
  striker = localStorage.getItem("current_strikerName") || "Striker";
  nonStriker = localStorage.getItem("current_nonStrikerName") || "Non-Striker";

  // Ensure batter entries exist
  batterStats[striker] = batterStats[striker] || { runs: 0, balls: 0, fours: 0, sixes: 0 };
  batterStats[nonStriker] = batterStats[nonStriker] || { runs: 0, balls: 0, fours: 0, sixes: 0 };

  // Ensure current bowler entry exists
  let bowler = localStorage.getItem("current_bowlerName") || "Bowler";
  if (!bowlerStats[bowler]) {
    bowlerStats[bowler] = { balls: 0, runs: 0, wickets: 0 };
  }
  updateScoreDisplay();
};