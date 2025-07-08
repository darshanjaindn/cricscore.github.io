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
    
      // Format for over log
      if (wide) runText = `wd+${runs}`;
      else if (noBall) runText = `nb+${runs}`;
      else if (byes) runText = `b+${runs}`;
      else if (legByes) runText = `lb+${runs}`;
      else if (wicket) runText = runs > 0 ? `wk+${runs}` : `wk`;
    
      // ✅ WICKET CASE
      if (wicket) {
        wickets++;
        score += runs;
    
        if (!wide && !noBall && !byes && !legByes) {
          batterStats[striker] = batterStats[striker] || { runs: 0, balls: 0, fours: 0, sixes: 0 };
          batterStats[striker].runs += runs;
          if (runs === 4) batterStats[striker].fours++;
          if (runs === 6) batterStats[striker].sixes++;
          if (ballCounted) {
            batterStats[striker].balls++;
          }
        }
    
        if (ballCounted) {
          balls++;
          bowlerStats[bowler].balls++;
        }
    
        bowlerStats[bowler].runs += runs;
        bowlerStats[bowler].wickets++;
    
        overLog.push(runText);
        persistMatchState();
    
        localStorage.setItem("lastOverStriker", striker);
        localStorage.setItem("lastOverNonStriker", nonStriker);
    
        window.location.href = "next_batsmen.html";
        return;
      }
    
      // ✅ EXTRAS CASE
      if (wide || noBall || byes || legByes) {
        score += runs + (wide || noBall ? 1 : 0); // wd or nb gives 1 extra base run
    
        if (wide || noBall) {
          bowlerStats[bowler].runs += runs + 1;
        } else {
          bowlerStats[bowler].runs += runs;
        }
    
        if (ballCounted) {
          balls++;
          bowlerStats[bowler].balls++;
        }
    
        overLog.push(runText);

        // ✅ Swap strike if byes or leg byes and odd runs
        if ((byes || legByes) && runs % 2 === 1) {
          swapBatsman(false);
        }
      }
      // ✅ NORMAL RUN CASE
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
        }
    
        bowlerStats[bowler].runs += runs;
    
        if (runs % 2 === 1) swapBatsman(false);
    
        overLog.push(runText);
      }
    
      // Count number of legal balls in this over
      const legalBallsInOver = overLog.filter(log => {
        return !log.startsWith("wd") && !log.startsWith("nb");
      }).length;

      // ✅ OVER COMPLETED — 6 legal balls bowled
      if (legalBallsInOver === 6) {
        swapBatsman(false);
        saveInningsToLocalStorage();
        localStorage.setItem("lastOverStriker", striker);
        localStorage.setItem("lastOverNonStriker", nonStriker);
        localStorage.setItem("newOverStarted", "true");
        overLog = [];

        persistMatchState();
        window.location.href = "next_bowler.html";
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

    function saveInningsToLocalStorage() {
      const battingTeam = currentInnings === "innings1" ? teamA : teamB;
      const bowlingTeam = currentInnings === "innings1" ? teamB : teamA;
    
      const savedData = JSON.parse(localStorage.getItem("matchData")) || {};
    
      // Initialize team objects
      if (!savedData[battingTeam]) savedData[battingTeam] = {};
      if (!savedData[bowlingTeam]) savedData[bowlingTeam] = {};
    
      const batters = [striker, nonStriker];
    
      // Save/update each batter
      batters.forEach(batter => {
        const stats = batterStats[batter];
        if (!savedData[battingTeam][batter]) {
          savedData[battingTeam][batter] = {
            score: 0,
            balls: 0,
            "4s": 0,
            "6s": 0,
            SR: "0.00"
          };
        }
    
        savedData[battingTeam][batter].score = stats.runs;
        savedData[battingTeam][batter].balls = stats.balls;
        savedData[battingTeam][batter]["4s"] = stats.fours;
        savedData[battingTeam][batter]["6s"] = stats.sixes;
        savedData[battingTeam][batter].SR = calculateSR(stats);
      });
    
      // Current bowler stats
      const currentBowlerStats = bowlerStats[bowler];
    
      // Check if bowler already exists
      const bowlerKey = Object.keys(savedData[bowlingTeam]).find(key => savedData[bowlingTeam][key].name === bowler);
    
      if (bowlerKey) {
        const b = savedData[bowlingTeam][bowlerKey];
        const [prevOvers, prevBalls] = b.overs.split('.').map(Number);
        const totalPrevBalls = (prevOvers * 6) + prevBalls;
    
        const newTotalBalls = totalPrevBalls + 6; // One over completed
        b.Runs = currentBowlerStats.runs;
        b.Wicket = currentBowlerStats.wickets;
        b.overs = `${Math.floor(newTotalBalls / 6)}.${newTotalBalls % 6}`;
        b.ER = (b.Runs / (newTotalBalls / 6)).toFixed(2);
      } else {
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
    
      // Save back to localStorage
      localStorage.setItem("matchData", JSON.stringify(savedData));
    }
    
    
    
    
    window.onload = () => {
      loadPersistedMatchState();
    
      // Reload current striker/non-striker names in case changed from next_batsmen.html
      striker = localStorage.getItem("current_strikerName") || "Striker";
      nonStriker = localStorage.getItem("current_nonStrikerName") || "Non-Striker";

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
      
      // Reset overLog display if new over started
      if (localStorage.getItem("newOverStarted") === "true") {
        overLog = [];
        localStorage.removeItem("newOverStarted");
      }

      updateScoreDisplay();
    };
    