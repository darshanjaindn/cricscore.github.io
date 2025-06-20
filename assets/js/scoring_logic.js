const teamA = localStorage.getItem("teamA") || "Team A";
    const teamB = localStorage.getItem("teamB") || "Team B";
    let striker = localStorage.getItem("strikerName") || "Striker";
    let nonStriker = localStorage.getItem("nonStrikerName") || "Non-striker";
    const bowler = localStorage.getItem("bowlerName") || "Bowler";
    const currentInnings = localStorage.getItem("currentInnings") || "innings1";

    let score = 0, wickets = 0, balls = 0;
    let overLog = [];

    let batterStats = {
      [striker]: { runs: 0, balls: 0, fours: 0, sixes: 0 },
      [nonStriker]: { runs: 0, balls: 0, fours: 0, sixes: 0 }
    };

    let bowlerStats = {
      [bowler]: {
        balls: 0,
        runs: 0,
        wickets: 0
      }
    };

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

    function calculateSR(batter) {
      return batter.balls > 0 ? ((batter.runs / batter.balls) * 100).toFixed(2) : "0.00";
    }

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
        overLog = [];
      }

      updateScoreDisplay();
      document.querySelectorAll('input[type="checkbox"]').forEach(el => el.checked = false);
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

    window.onload = () => {
      // initialize batter stats if not already
      batterStats[striker] = batterStats[striker] || { runs: 0, balls: 0, fours: 0, sixes: 0 };
      batterStats[nonStriker] = batterStats[nonStriker] || { runs: 0, balls: 0, fours: 0, sixes: 0 };
      bowlerStats[bowler] = bowlerStats[bowler] || { balls: 0, runs: 0, wickets: 0 };
      updateScoreDisplay();
    };