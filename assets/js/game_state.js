document.addEventListener('DOMContentLoaded', function () {
  const strikerInput = document.getElementById('strikerName');
  const nonStrikerInput = document.getElementById('nonStrikerName');
  const bowlerInput = document.getElementById('bowlerName');
  const startMatchButton = document.getElementById('startMatch');
  const startNextInningsButton = document.getElementById('startNextInnings');

  const battingTeam = localStorage.getItem('battingTeam');
  const bowlingTeam = localStorage.getItem('bowlingTeam');
  const inningsData = {};

  const battingTeamEl = document.getElementById('battingTeam');
  const bowlingTeamEl = document.getElementById('bowlingTeam');

  if (battingTeamEl) {
    battingTeamEl.textContent = battingTeam || 'Batting Team';
  }

  if (bowlingTeamEl) {
    bowlingTeamEl.textContent = bowlingTeam || 'Bowling Team';
  }

  function saveInningsData(inningsKey) {
    const striker = strikerInput.value.trim();
    const nonStriker = nonStrikerInput.value.trim();
    const bowler = bowlerInput.value.trim();

    if (!striker || !nonStriker || !bowler) {
      alert('Please fill in all player names.');
      return;
    }

    localStorage.setItem("current_strikerName", striker);
    localStorage.setItem("current_nonStrikerName", nonStriker);
    localStorage.setItem("current_bowlerName", bowler);
    localStorage.setItem("currentInnings", inningsKey);

    inningsData[battingTeam] = {
      batter1: striker,
      batter2: nonStriker
    };
    inningsData[bowlingTeam] = {
      bowler: bowler
    };

    localStorage.setItem(inningsKey, JSON.stringify(inningsData));

    // ✅ Redirect after saving
    window.location.href = 'scoring.html';
  }

  const inningsCompleted = localStorage.getItem("inningsCompleted");

  if (startMatchButton) {
    if (inningsCompleted === "1") {
      // Set up for 2nd innings
      startMatchButton.textContent = "Start 2nd Innings";
      startMatchButton.addEventListener('click', function () {
        saveInningsData('innings2');
      });
    } else {
      // 1st innings
      startMatchButton.addEventListener('click', function () {
        saveInningsData('innings1');
      });
    }
  }

  if (!strikerInput || !nonStrikerInput || !bowlerInput) {
    console.error("Missing one or more player input fields.");
    return;
  }

});