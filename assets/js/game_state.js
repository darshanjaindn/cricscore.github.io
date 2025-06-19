document.addEventListener("DOMContentLoaded", function () {
  const battingTeam = localStorage.getItem("battingTeam") || "Batting Team";
  const bowlingTeam = localStorage.getItem("bowlingTeam") || "Bowling Team";

  document.getElementById("battingTeamName").textContent = "Batting Team: " + battingTeam;
  document.getElementById("bowlingTeamName").textContent = "Bowling Team: " + bowlingTeam;
});

function startMatch() {
  const strikerName = document.getElementById("strikerName").value.trim();
  const nonStrikerName = document.getElementById("nonStrikerName").value.trim();
  const bowlerName = document.getElementById("bowlerName").value.trim();

  if (!strikerName || !nonStrikerName || !bowlerName) {
    alert("Please fill in all player names.");
    return;
  }

  localStorage.setItem("strikerName", strikerName);
  localStorage.setItem("nonStrikerName", nonStrikerName);
  localStorage.setItem("bowlerName", bowlerName);

  window.location.href = "scoring.html";
}
