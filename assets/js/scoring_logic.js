    const teamA = localStorage.getItem("teamA") || "Team A";
    const teamB = localStorage.getItem("teamB") || "Team B";
    
    let striker = localStorage.getItem("current_strikerName") || "Striker";
    let nonStriker = localStorage.getItem("current_nonStrikerName") || "Non-striker";
    let bowler = localStorage.getItem("current_bowlerName") || "Bowler";
    let currentInnings = localStorage.getItem("currentInnings") || "innings1";
    
    let battingTeam = localStorage.getItem("battingTeam") || teamA;
    let bowlingTeam = localStorage.getItem("bowlingTeam") || teamB;

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
    
      // Display match title (fixed teams)
      document.getElementById("matchTitle").innerText = `${teamA} vs ${teamB}`;
    
      // Decide batting team based on current innings
      let battingTeam = (currentInnings === "innings1") ? teamA : teamB;
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

        // ALL OUT CHECK (10 wickets fallen)
        if (wickets >= 10) {
          saveInningsToLocalStorage();
          persistMatchState();
          localStorage.setItem("inningsCompleted", "1");

          // Swap teams for next innings
          const batting = localStorage.getItem("battingTeam");
          const bowling = localStorage.getItem("bowlingTeam");
          localStorage.setItem("battingTeam", bowling);
          localStorage.setItem("bowlingTeam", batting);

          window.location.href = "player_setup.html";
          return;
        }

        // Update batter stats only if legal ball (no extras)
        if (!wide && !noBall && !byes && !legByes) {
          batterStats[striker] = batterStats[striker] || { runs: 0, balls: 0, fours: 0, sixes: 0 };
          batterStats[striker].runs += runs;
          if (runs === 4) batterStats[striker].fours++;
          if (runs === 6) batterStats[striker].sixes++;
          if (ballCounted) batterStats[striker].balls++;
        }

        if (ballCounted) {
          balls++;
          bowlerStats[bowler].balls++;
          persistMatchState();
          checkInningsCompletion();
        }

        bowlerStats[bowler].runs += runs;
        bowlerStats[bowler].wickets++;

        // Push ball log
        overLog.push(runText);
        persistMatchState();

        localStorage.setItem("lastOverStriker", striker);
        localStorage.setItem("lastOverNonStriker", nonStriker);

        // Now check if innings is completed due to max balls or max wickets
        const totalOvers = parseInt(localStorage.getItem("overs"), 10);
        const maxBalls = totalOvers * 6;

        if (balls >= maxBalls || wickets >= 10) {
          // Innings ended, redirect to player_setup.html for next innings
          saveInningsToLocalStorage();
          persistMatchState();
          localStorage.setItem("inningsCompleted", "1");

          // Swap teams for next innings
          const batting = localStorage.getItem("battingTeam");
          const bowling = localStorage.getItem("bowlingTeam");
          localStorage.setItem("battingTeam", bowling);
          localStorage.setItem("bowlingTeam", batting);

          window.location.href = "player_setup.html";
          return;
        }

        // If wicket on 6th legal ball of over, mark flag and reset over
        if (legalBallsInOver === 6) {
          localStorage.setItem("overCompletedAfterWicket", "true");
          overLog = [];
          localStorage.setItem("newOverStarted", "true");
          saveInningsToLocalStorage();
          persistMatchState();

          // Redirect to next batsman page (innings not ended)
          window.location.href = "next_batsmen.html";
        } else {
          // Normal wicket redirect to next batsman page
          window.location.href = "next_batsmen.html";
        }
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
        }
    
        overLog.push(runText);
    
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
        }
    
        bowlerStats[bowler].runs += runs;
    
        if (runs % 2 === 1) swapBatsman(false);
    
        overLog.push(runText);
      }
    
      // ===== OVER COMPLETION CHECK =====
      if (legalBallsInOver === 6) {
        swapBatsman(false);
        saveInningsToLocalStorage();
        localStorage.setItem("lastOverStriker", striker);
        localStorage.setItem("lastOverNonStriker", nonStriker);
        localStorage.setItem("newOverStarted", "true");
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
      let battingTeam = currentInnings === "innings1" ? teamA : teamB;
      let bowlingTeam = currentInnings === "innings1" ? teamB : teamA;
    
      // Get existing data or initialize new object for the current innings
      let storageKey = currentInnings === "innings1" ? "matchData1" : "matchData2";
      let savedData = JSON.parse(localStorage.getItem(storageKey)) || {};
    
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
    
      // Find bowler key by name (if exists)
      const bowlerKey = Object.keys(savedData[bowlingTeam]).find(
        key => savedData[bowlingTeam][key].name === bowler
      );
    
      if (bowlerKey) {
        const b = savedData[bowlingTeam][bowlerKey];
        const [prevOvers, prevBalls] = b.overs.split('.').map(Number);
        const totalPrevBalls = (prevOvers * 6) + prevBalls;
    
        const newTotalBalls = currentBowlerStats.balls; // Use current balls directly
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
    
      // Save back to localStorage under appropriate innings key
      localStorage.setItem(storageKey, JSON.stringify(savedData));
    }
    
    // Start the second Innings 
    function startSecondInnings() {
      currentInnings = "innings2";
      localStorage.setItem("currentInnings", "innings2");
    
      const secondInningsStarted = localStorage.getItem("secondInningsStarted") === "true";
    
      if (secondInningsStarted) {
        // Already started, load from persisted state
        loadPersistedMatchState();
        updateScoreDisplay();
        return;
      }
      // Saving 1st innings score
      localStorage.setItem("innings1_score", localStorage.getItem("match_score") || "0");
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
    
      battingTeam = teamB;
      bowlingTeam = teamA;
    
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
        
    function resetPlayerStats() {
      // Reset match state
      score = 0;
      wickets = 0;
      balls = 0;
      overLog = [];
    
      // Re-fetch current striker, non-striker, and bowler
      striker = localStorage.getItem("current_strikerName") || "Striker";
      nonStriker = localStorage.getItem("current_nonStrikerName") || "Non-striker";
      bowler = localStorage.getItem("current_bowlerName") || "Bowler";
    
      // Reset batter stats with only new striker/non-striker
      batterStats = {};
      batterStats[striker] = { runs: 0, balls: 0, fours: 0, sixes: 0 };
      batterStats[nonStriker] = { runs: 0, balls: 0, fours: 0, sixes: 0 };
    
      // Reset bowler stats
      bowlerStats = {};
      bowlerStats[bowler] = { balls: 0, runs: 0, wickets: 0 };
    
      // Clear persisted match state
      localStorage.setItem("match_score", score);
      localStorage.setItem("match_wickets", wickets);
      localStorage.setItem("match_balls", balls);
      localStorage.setItem("match_batterStats", JSON.stringify(batterStats));
      localStorage.setItem("match_bowlerStats", JSON.stringify(bowlerStats));
      localStorage.setItem("match_overLog", JSON.stringify(overLog));
    }
    
    function determineMatchWinner() {
      const teamA = localStorage.getItem("teamA");
      const teamB = localStorage.getItem("teamB");
    
      const firstInningsScore = parseInt(localStorage.getItem("innings1_score"), 10) || 0;
      const secondInningsScore = score; // current score in memory
    
      let winner = "";
      let winMessage = "";
    
      if (secondInningsScore > firstInningsScore) {
        winner = teamB;
        winMessage = `${teamB} chased down ${firstInningsScore} and won the match! 🎉`;
      } else {
        winner = teamA;
        winMessage = `${teamB} couldn't chase ${firstInningsScore}. ${teamA} wins! 🏆`;
      }
    
      localStorage.setItem("matchWinner", winner);
      localStorage.setItem("winMessage", winMessage);
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
          determineMatchWinner();
          return true;
        }
    
        if (balls >= maxBalls || wickets >= 10) {
          matchEnded = true;
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
          const batting = localStorage.getItem("battingTeam");
          const bowling = localStorage.getItem("bowlingTeam");
          localStorage.setItem("innings1_score", score.toString());
          localStorage.setItem("battingTeam", bowling);
          localStorage.setItem("bowlingTeam", batting);
          localStorage.setItem("currentInnings", "innings2");
    
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