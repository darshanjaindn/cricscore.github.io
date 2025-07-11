(function() {
  function loadMatchData() {
    return {
      teamA: localStorage.getItem("teamA"),
      teamB: localStorage.getItem("teamB"),
      tossWinner: localStorage.getItem("tossWinner"),
      opted: localStorage.getItem("opted"),
      overs: localStorage.getItem("overs"),
      matchWinner: localStorage.getItem("matchWinner"),
      matchVictoryType: localStorage.getItem("matchVictoryType"),
      matchMargin: localStorage.getItem("matchMargin"),
      innings1Score: localStorage.getItem("innings1_score"),
      innings1Wickets: localStorage.getItem("innings1_wickets"),
      innings2Score: localStorage.getItem("match_score"),
      innings2Wickets: localStorage.getItem("innings2_wickets"),
      innings1: JSON.parse(localStorage.getItem("innings1_data") || "{}"),
      innings2: JSON.parse(localStorage.getItem("matchData2") || "{}")
    };
  }

  function populateScorecard(data) {
    document.getElementById("matchTitle").innerText = `${data.teamA} vs ${data.teamB}`;
    document.getElementById("matchResult").innerText = `${data.matchWinner} ${data.matchVictoryType} ${data.matchMargin}`;

    // Helper to build tables
    function fillTables(inningsData, batTableId, bowlTableId, teamName) {
      document.getElementById(batTableId).innerHTML = `
        <tr><th>Batsman</th><th>R</th><th>B</th><th>4s</th><th>6s</th><th>SR</th></tr>
        ${Object.values(inningsData[teamName]).filter(p => p.name !== undefined).map(p => `
          <tr>
            <td>${p.name}</td><td>${p.score}</td><td>${p.balls}</td><td>${p["4s"]}</td><td>${p["6s"]}</td><td>${p.SR}</td>
          </tr>
        `).join("")}
      `;
      document.getElementById(bowlTableId).innerHTML = `
        <tr><th>Bowler</th><th>O</th><th>R</th><th>W</th><th>ER</th></tr>
        ${Object.values(inningsData[Object.keys(inningsData).find(k => k !== teamName)]).filter(p => p.name).map(b => `
          <tr>
            <td>${b.name}</td><td>${b.overs}</td><td>${b.Runs}</td><td>${b.Wicket}</td><td>${b.ER}</td>
          </tr>
        `).join("")}
      `;
    }

    document.getElementById("innings1_team").innerText = data.teamA;
    fillTables(data.innings1, "innings1_bat", "innings1_bowl", data.teamA);
    document.getElementById("innings2_team").innerText = data.teamB;
    fillTables(data.innings2, "innings2_bat", "innings2_bowl", data.teamB);
  }

  window.downloadJSON = function() {
    const data = loadMatchData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${data.teamA}_vs_${data.teamB}_Scorecard.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  populateScorecard(loadMatchData());
})();
