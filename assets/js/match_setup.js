function startMatch() {
    const teamA = document.getElementById('teamA').value.trim();
    const teamB = document.getElementById('teamB').value.trim();
    const overs = parseInt(document.getElementById('overs').value);
    const tossWinner = document.querySelector('input[name="toss"]:checked');
    const opted = document.querySelector('input[name="opt"]:checked');
  
    if (!teamA || !teamB || !overs || overs < 1 || overs > 50 || !tossWinner || !opted) {
      alert("Please fill all fields correctly.");
      return;
    }
  
    const tossWinnerTeam = tossWinner.value === "A" ? teamA : teamB;
    const optedChoice = opted.value;
  
    let battingTeam = "";
    let bowlingTeam = "";
  
    if (optedChoice.toLowerCase() === "bat") {
      battingTeam = tossWinnerTeam;
      bowlingTeam = tossWinnerTeam === teamA ? teamB : teamA;
    } else {
      bowlingTeam = tossWinnerTeam;
      battingTeam = tossWinnerTeam === teamA ? teamB : teamA;
    }
  
    localStorage.setItem("teamA", teamA);
    localStorage.setItem("teamB", teamB);
    localStorage.setItem("overs", overs);
    localStorage.setItem("tossWinner", tossWinnerTeam);
    localStorage.setItem("opted", optedChoice);
    localStorage.setItem("battingTeam", battingTeam);
    localStorage.setItem("bowlingTeam", bowlingTeam);
  
    window.location.href = "player_setup.html";
  }
  
  // Update toss labels dynamically
  document.addEventListener("DOMContentLoaded", function() {
    const teamAInput = document.getElementById("teamA");
    const teamBInput = document.getElementById("teamB");
    const labelTossA = document.getElementById("labelTossA");
    const labelTossB = document.getElementById("labelTossB");
  
    function updateLabels() {
      labelTossA.textContent = teamAInput.value || "Host Team";
      labelTossB.textContent = teamBInput.value || "Visitor Team";
    }
  
    teamAInput.addEventListener("input", updateLabels);
    teamBInput.addEventListener("input", updateLabels);
  });
  