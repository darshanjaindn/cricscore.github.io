document.addEventListener('DOMContentLoaded', function () {
  const strikerInput = document.getElementById('strikerName');
  const nonStrikerInput = document.getElementById('nonStrikerName');
  const bowlerInput = document.getElementById('bowlerName');
  const startMatchButton = document.getElementById('startMatch');
  const startNextInningsButton = document.getElementById('startNextInnings');

  const battingTeamName = localStorage.getItem('battingTeam');
  const bowlingTeamName = localStorage.getItem('bowlingTeam');

  document.getElementById('battingTeamHeader').textContent = battingTeamName || 'Batting Team';
  document.getElementById('bowlingTeamHeader').textContent = bowlingTeamName || 'Bowling Team';

  function saveInningsData(inningsKey) {
    const striker = strikerInput.value.trim();
    const nonStriker = nonStrikerInput.value.trim();
    const bowler = bowlerInput.value.trim();

    if (!striker || !nonStriker || !bowler) {
      alert('Please fill in all player names.');
      return;
    }

    const inningsData = {};
    inningsData[battingTeamName] = {
      batter1: striker,
      batter2: nonStriker
    };
    inningsData[bowlingTeamName] = {
      bowler: bowler
    };

    localStorage.setItem(inningsKey, JSON.stringify(inningsData));
    window.location.href = 'scoring.html';
  }

  if (startMatchButton) {
    startMatchButton.addEventListener('click', function () {
      saveInningsData('innings1');
    });
  }

  if (startNextInningsButton) {
    startNextInningsButton.addEventListener('click', function () {
      saveInningsData('innings2');
    });
  }
});