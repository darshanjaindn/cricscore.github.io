document.addEventListener('DOMContentLoaded', function () {
  const strikerInput = document.getElementById('strikerName');
  const nonStrikerInput = document.getElementById('nonStrikerName');
  const bowlerInput = document.getElementById('bowlerName');
  const startMatchButton = document.getElementById('startMatch');
  const startNextInningsButton = document.getElementById('startNextInnings');

  const battingTeam = localStorage.getItem('battingTeam');
  const bowlingTeam = localStorage.getItem('bowlingTeam');

  const startButton = document.getElementById('startMatch');
  document.getElementById('battingTeamName').textContent = battingTeam || 'Batting Team';
  document.getElementById('bowlingTeamName').textContent = bowlingTeam || 'Bowling Team';

  function saveInningsData(inningsKey) {
    const striker = strikerInput.value.trim();
    const nonStriker = nonStrikerInput.value.trim();
    const bowler = bowlerInput.value.trim();

    if (!striker || !nonStriker || !bowler) {
      alert('Please fill in all player names.');
      return;
    }
    localStorage.setItem("current_innings", inningsKey);
    inningsData[battingTeam] = {
      batter1: striker,
      batter2: nonStriker
    };
    inningsData[bowlingTeam] = {
      bowler: bowler
    };
    localStorage.setItem()
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
  
  startButton.addEventListener('click', function () {
    window.location.href = 'scoring.html';
  });
  
});