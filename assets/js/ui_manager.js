const uiManager = {
    updateUI: function () {
      const match = gameState.currentMatch;
  
      // Update team score
      document.getElementById('teamScore').innerText = `${match.totalRuns}/${match.totalWickets}`;
      document.getElementById('oversBowled').innerText = `${match.totalOvers}.${match.currentOver.balls}`;
  
      // Update batsman info with * on striker
      const striker = match.striker;
      const nonStriker = match.nonStriker;
      const strikerRuns = match.batsmen[striker] || 0;
      const nonStrikerRuns = match.batsmen[nonStriker] || 0;
  
      document.getElementById('strikerInfo').innerText = `${striker}* - ${strikerRuns}`;
      document.getElementById('nonStrikerInfo').innerText = `${nonStriker} - ${nonStrikerRuns}`;
  
      // Update bowler
      document.getElementById('bowlerInfo').innerText = match.bowler || "N/A";
  
      // Update current over events
      const thisOverDiv = document.getElementById('thisOverEvents');
      thisOverDiv.innerHTML = '';
      match.currentOver.events.forEach((ball, index) => {
        const span = document.createElement('span');
        span.classList.add('badge', 'bg-secondary', 'm-1');
        span.innerText = ball;
        thisOverDiv.appendChild(span);
      });
    },
  
    showNextBowlerModal: function () {
      const modal = new bootstrap.Modal(document.getElementById('nextBowlerModal'));
      modal.show();
    },
  
    confirmNextBowler: function () {
      const bowler = document.getElementById('newBowlerName').value.trim();
      if (bowler) {
        scoringLogic.setNewBowler(bowler);
        gameState.save();
        bootstrap.Modal.getInstance(document.getElementById('nextBowlerModal')).hide();
        uiManager.updateUI();
      }
    },
  
    showWicketModal: function () {
      const modal = new bootstrap.Modal(document.getElementById('wicketModal'));
      modal.show();
    },
  
    confirmWicket: function () {
      const outPlayer = document.querySelector('input[name="outPlayer"]:checked').value;
      const nextBatsman = document.getElementById('nextBatsmanName').value.trim();
      if (nextBatsman) {
        scoringLogic.handleWicket(outPlayer, nextBatsman);
        gameState.save();
        bootstrap.Modal.getInstance(document.getElementById('wicketModal')).hide();
        uiManager.updateUI();
      }
    },
  
    handleBallInput: function (inputValue) {
      scoringLogic.deliverBall(inputValue);
  
      // Check for over completion
      if (gameState.currentMatch.currentOver.balls === 6) {
        gameState.completeOver();
        uiManager.showNextBowlerModal();
      }
  
      uiManager.updateUI();
    },
  
    handleWicketEvent: function () {
      uiManager.showWicketModal();
    },
  
    handleUndo: function () {
      scoringLogic.undoLastBall();
      gameState.save();
      uiManager.updateUI();
    }
  };