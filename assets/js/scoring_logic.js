const teamA = localStorage.getItem("teamA") || "Team A";
    const teamB = localStorage.getItem("teamB") || "Team B";
    let striker = localStorage.getItem("current_strikerName") || "Striker";
    let nonStriker = localStorage.getItem("current_nonStrikerName") || "Non-striker";
    const bowler = localStorage.getItem("current_bowlerName") || "Bowler";
    const currentInnings = localStorage.getItem("currentInnings") || "innings1";

    // Initial of match status
    let score = 0, wickets = 0, balls = 0;
    let overLog = [];

    // Init of batters
    let batterStats = {
      [striker]: { runs: 0, balls: 0, fours: 0, sixes: 0 },
      [nonStriker]: { runs: 0, balls: 0, fours: 0, sixes: 0 }
    };

    // Init of bowlers
    let bowlerStats = {
      [bowler]: {
        balls: 0,
        runs: 0,
        wickets: 0
      }
    };

    // Update score display
    function updateScoreDisplay() {
      const overs = Math.floor(balls / 6);
      const currentBall = balls % 6;
      const crr = (balls > 0) ? (score / (balls / 6)).toFixed(2) : "0.00";
      document.getElementById("matchTitle").innerText = `${teamA} vs ${teamB}`;
      document.getElementById("scoreDisplay").innerText = `${currentInnings === "innings1" ? teamA : teamB} Batting, ${score}-${wickets} (${overs}.${currentBall})`;
      document.getElementById("crrDisplay").innerText = `CRR: ${crr}`;

      // Batters
      document.getElementById("strikerName").innerText = striker + "*";
      document.getElementById("strikerRuns").innerText = batterStats[striker].runs;
      document.getElementById("strikerBalls").innerText = batterStats[striker].balls;
      document.getElementById("striker4").innerText = batterStats[striker].fours;
      document.getElementById("striker6").innerText = batterStats[striker].sixes;
      document.getElementById("strikerSR").innerText = calculateSR(batterStats[striker]);

      document.getElementById("nonStrikerName").innerText = nonStriker;
      document.getElementById("nonStrikerRuns").innerText = batterStats[nonStriker].runs;
      document.getElementById("nonStrikerBalls").innerText = batterStats[nonStriker].balls;
      document.getElementById("nonStriker4").innerText = batterStats[nonStriker].fours;
      document.getElementById("nonStriker6").innerText = batterStats[nonStriker].sixes;
      document.getElementById("nonStrikerSR").innerText = calculateSR(batterStats[nonStriker]);

      // Bowler
      const b = bowlerStats[bowler];
      const bowlerOvers = `${Math.floor(b.balls / 6)}.${b.balls % 6}`;
      const bowlerER = b.balls > 0 ? (b.runs / (b.balls / 6)).toFixed(2) : "0.00";
      document.getElementById("bowlerName").innerText = bowler;
      document.getElementById("bowlerOvers").innerText = bowlerOvers;
      document.getElementById("bowlerRuns").innerText = b.runs;
      document.getElementById("bowlerWickets").innerText = b.wickets;
      document.getElementById("bowlerER").innerText = bowlerER;

      // Over log
      document.getElementById("overLog").innerHTML = `<strong>This over:</strong> ${overLog.map(r => `<span>${r}</span>`).join("")}`;
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

      let ballCounted = !wide && !noBall;
      let runText = runs.toString();

      if (wide) runText = `wd+${runs}`;
      if (noBall) runText = `nb+${runs}`;
      if (wicket) {
        runText = "wk";
        wickets++;
        if (ballCounted) {
          balls++;
          bowlerStats[bowler].balls++;
        }
        bowlerStats[bowler].wickets++;
      } else {
        score += runs;
        if (!batterStats[striker]) {
          batterStats[striker] = { runs: 0, balls: 0, fours: 0, sixes: 0 };
        }
        batterStats[striker].runs += runs;
        if (ballCounted) {
          batterStats[striker].balls++;
          bowlerStats[bowler].balls++;
          balls++;
        }
        if (runs === 4) batterStats[striker].fours++;
        if (runs === 6) batterStats[striker].sixes++;
        bowlerStats[bowler].runs += runs;
        if (runs % 2 === 1) swapBatsman(false); // swap strike only on odd runs
      }

      overLog.push(runText);
      
      if (overLog.length === 6) {
        saveInningsToLocalStorage();
        localStorage.setItem("lastOverStriker", striker);
        localStorage.setItem("lastOverNonStriker", nonStriker);
        localStorage.setItem("newOverStarted", "true"); // ✅ Flag to reset overLog
        overLog = [];
        // Persist after scoring
        persistMatchState();
        window.location.href = "select_bowler.html"; // redirect to input next bowler
      }
      

      updateScoreDisplay();
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

    function saveInningsToLocalStorage() {
      const battingTeam = currentInnings === "innings1" ? teamA : teamB;
      const bowlingTeam = currentInnings === "innings1" ? teamB : teamA;
    
      const savedData = JSON.parse(localStorage.getItem("matchData")) || {};
    
      // Batter stats snapshot
      const batter1 = {
        name: striker,
        score: batterStats[striker].runs,
        balls: batterStats[striker].balls,
        "4s": batterStats[striker].fours,
        "6s": batterStats[striker].sixes,
        SR: calculateSR(batterStats[striker])
      };
    
      const batter2 = {
        name: nonStriker,
        score: batterStats[nonStriker].runs,
        balls: batterStats[nonStriker].balls,
        "4s": batterStats[nonStriker].fours,
        "6s": batterStats[nonStriker].sixes,
        SR: calculateSR(batterStats[nonStriker])
      };
    
      // Current bowler stats
      const currentBowlerStats = bowlerStats[bowler];
    
      // Initialize innings arrays
      if (!Array.isArray(savedData[battingTeam])) {
        savedData[battingTeam] = [];
      }
    
      if (!savedData[bowlingTeam]) {
        savedData[bowlingTeam] = {};
      }
    
      // Push batter snapshot
      savedData[battingTeam].push({
        batter1,
        batter2
      });
    
      // Handle bowler
      const bowlerKey = Object.keys(savedData[bowlingTeam]).find(key => savedData[bowlingTeam][key].name === bowler);
      if (bowlerKey) {
        const b = savedData[bowlingTeam][bowlerKey];
    
        // Parse existing overs
        const [prevOvers, prevBalls] = b.overs.split('.').map(Number);
        const totalPrevBalls = (prevOvers * 6) + prevBalls;
    
        // Calculate updated totals
        const totalBalls = totalPrevBalls + 6; // ✅ One over just completed
        const newRuns = currentBowlerStats.runs - b.Runs;
        const newWickets = currentBowlerStats.wickets - b.Wicket;
    
        b.Runs = currentBowlerStats.runs;
        b.Wicket = currentBowlerStats.wickets;
        b.overs = `${Math.floor(totalBalls / 6)}.${totalBalls % 6}`;
        b.ER = (b.Runs / (totalBalls / 6)).toFixed(2);
    
      } else {
        // New bowler
        const bowlerCount = Object.keys(savedData[bowlingTeam]).length + 1;
        const balls = currentBowlerStats.balls;
        savedData[bowlingTeam][`bowler${bowlerCount}`] = {
          name: bowler,
          overs: `${Math.floor(balls / 6)}.${balls % 6}`,
          Maidens: "",
          Runs: currentBowlerStats.runs,
          Wicket: currentBowlerStats.wickets,
          ER: balls > 0 ? (currentBowlerStats.runs / (balls / 6)).toFixed(2) : "0.00"
        };
      }
    
      localStorage.setItem("matchData", JSON.stringify(savedData));
    }
    
    
    
    window.onload = () => {
      loadPersistedMatchState();
    
      // Ensure batter entries exist
      batterStats[striker] = batterStats[striker] || { runs: 0, balls: 0, fours: 0, sixes: 0 };
      batterStats[nonStriker] = batterStats[nonStriker] || { runs: 0, balls: 0, fours: 0, sixes: 0 };
    
      // Ensure current bowler entry exists
      if (!bowlerStats[bowler]) {
        bowlerStats[bowler] = { balls: 0, runs: 0, wickets: 0 };
      }
    
      // Merge previous stats from matchData if the bowler has bowled earlier
      const teamA = localStorage.getItem("teamA");
      const teamB = localStorage.getItem("teamB");
      const currentInnings = localStorage.getItem("currentInnings") || "innings1";
      const bowlingTeam = currentInnings === "innings1" ? teamB : teamA;
    
      const matchData = JSON.parse(localStorage.getItem("matchData")) || {};
      const bowlers = matchData[bowlingTeam] || {};
    
      for (const key in bowlers) {
        if (bowlers[key].name === bowler) {
          const prevStats = bowlers[key];
          const [overs, ballsRemainder] = prevStats.overs.split(".").map(Number);
          const totalBalls = overs * 6 + ballsRemainder;
    
          // Update bowlerStats for this bowler from matchData
          bowlerStats[bowler].balls = totalBalls;
          bowlerStats[bowler].runs = prevStats.Runs;
          bowlerStats[bowler].wickets = prevStats.Wicket;
          break;
        }
      }
    
      updateScoreDisplay();
    };
    