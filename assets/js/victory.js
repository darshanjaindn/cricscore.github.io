function startNewMatch() {
  const confirmStart = confirm("Are you sure you want to start a new match? All current data will be lost.");
  if (confirmStart) {
    localStorage.clear();
    window.location.href = "index.html";
  }
}

(function () {
  function loadMatchData() {
    return {
      teamA: localStorage.getItem("teamA") || "Team A",
      teamB: localStorage.getItem("teamB") || "Team B",

      innings1Score: localStorage.getItem("innings1_score") || "0",
      innings1Wickets: localStorage.getItem("innings1_wickets") || "0",
      innings1Balls: localStorage.getItem("innings1_ballsFaced") || "0",
      
      innings2Score: localStorage.getItem("match_score") || "0",
      innings2Wickets: localStorage.getItem("match_wickets") || "0",
      innings2Balls: localStorage.getItem("match_balls") || "0",
      outBatsmen: JSON.parse(localStorage.getItem("outBatsmen") || "[]"),
      innings1: JSON.parse(localStorage.getItem("innings1_data") || "{}"),
      innings2: JSON.parse(localStorage.getItem("matchData2") || "{}"),
      matchWinner: localStorage.getItem("matchWinner") || "Unknown",
      matchVictoryType: localStorage.getItem("matchVictoryType") || "",
      matchMargin: localStorage.getItem("matchMargin") || ""
    };
  }

  function formatOvers(ballCount) {
    const b = Number(ballCount) || 0;
    const o = Math.floor(b / 6);
    const r = b % 6;
    return `${o}.${r}`;
  }

  function safeGet(obj, path, defaultValue = {}) {
    return path.split('.').reduce((o, key) => (o && o[key] !== undefined ? o[key] : defaultValue), obj);
  }

  function populateScorecard(data) {
    const titleEl = document.getElementById("matchTitle");
    const resultEl = document.getElementById("matchResult");
    const in1Heading = document.getElementById("innings1_heading");
    const in2Heading = document.getElementById("innings2_heading");
    const in1BatEl = document.getElementById("innings1_bat");
    const in1BowlEl = document.getElementById("innings1_bowl");
    const in2BatEl = document.getElementById("innings2_bat");
    const in2BowlEl = document.getElementById("innings2_bowl");
  
    if (!titleEl || !resultEl || !in1Heading || !in1BatEl || !in1BowlEl || !in2Heading || !in2BatEl || !in2BowlEl) {
      console.error("⚠️ Missing DOM elements in victory.html");
      return;
    }
  
    titleEl.innerText = `${data.teamA} vs ${data.teamB}`;
    resultEl.innerText = `${data.matchWinner} ${data.matchVictoryType} ${data.matchMargin}`;
    resultEl.style.color = "#ffff"; // white
  
    const trophy = " 🏆";
    const isTeamAWinner = data.teamA === data.matchWinner;
    const isTeamBWinner = data.teamB === data.matchWinner;

    const innings1Summary = `${data.teamA}${isTeamAWinner ? trophy : ""} – ${data.innings1Score}/${data.innings1Wickets} (${formatOvers(data.innings1Balls)})`;
    const innings2Summary = `${data.teamB}${isTeamBWinner ? trophy : ""} – ${data.innings2Score}/${data.innings2Wickets} (${formatOvers(data.innings2Balls)})`;
  
    in1Heading.innerText = innings1Summary;
    in2Heading.innerText = innings2Summary;
  
    fillTables(data.innings1, in1BatEl, in1BowlEl, data.teamA, data.outBatsmen);
    fillTables(data.innings2, in2BatEl, in2BowlEl, data.teamB, data.outBatsmen);
  }
  
  function fillTables(inningsData, battable, bowltable, teamName, outBatsmen = []) {
    const batArr = inningsData?.[teamName] || {};
    const opponent = Object.keys(inningsData).find(k => k !== teamName);
    const bowlArr = inningsData?.[opponent] || {};
  
    battable.innerHTML = `<tr><th>Batsman</th><th>R</th><th>B</th><th>4s</th><th>6s</th><th>SR</th></tr>`;
    Object.values(batArr).forEach(p => {
      if (!p.name) return;
      const star = outBatsmen.includes(p.name) ? "" : "*";
      battable.innerHTML += `
        <tr>
          <td>${p.name}${star}</td>
          <td>${p.score}</td>
          <td>${p.balls}</td>
          <td>${p["4s"]}</td>
          <td>${p["6s"]}</td>
          <td>${p.SR}</td>
        </tr>`;
    });
  
    bowltable.innerHTML = `<tr><th>Bowler</th><th>O</th><th>R</th><th>W</th><th>ER</th></tr>`;
    Object.values(bowlArr).forEach(b => {
      if (!b.name) return;
      bowltable.innerHTML += `
        <tr>
          <td>${b.name}</td>
          <td>${b.overs}</td>
          <td>${b.Runs}</td>
          <td>${b.Wicket}</td>
          <td>${b.ER}</td>
        </tr>`;
    });
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const data = loadMatchData();
    populateScorecard(data);

    const btn = document.getElementById("confirmNewMatchBtn");
    if (btn) {
      btn.addEventListener("click", () => {
        const summary = {
          date: new Date().toISOString(),
          teams: `${data.teamA} vs ${data.teamB}`,
          result: `${data.matchWinner} ${data.matchVictoryType} ${data.matchMargin}`
        };
        const historyArr = JSON.parse(localStorage.getItem("matchHistory") || "[]");
        historyArr.unshift(summary);
        localStorage.setItem("matchHistory", JSON.stringify(historyArr));
        if (confirm("Start new match? Make sure you have saved current scorecard.")) {
          localStorage.clear();
          window.location.href = "index.html";
        }
      });
    }
  });
})();
