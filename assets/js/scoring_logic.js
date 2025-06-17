const scoringLogic = {
    deliverBall: function (input) {
      const match = gameState.currentMatch;
      const striker = match.striker;
      const nonStriker = match.nonStriker;
      const bowler = match.bowler;
      const over = match.currentOver;
  
      let eventLabel = input;
      let legalBall = true;
      let extraRun = 0;
      let batsmanRun = 0;
  
      // Handle extra inputs like wd+2 or nb+4
      if (input.startsWith("wd")) {
        legalBall = false;
        eventLabel = input;
        extraRun = parseInt(input.split('+')[1] || "0") + 1;
      } else if (input.startsWith("nb")) {
        legalBall = false;
        eventLabel = input;
        extraRun = parseInt(input.split('+')[1] || "0") + 1;
      } else if (input === "wk") {
        match.totalWickets++;
        over.events.push("W");
        if (legalBall) over.balls++;
        uiManager.handleWicketEvent();
        return;
      } else {
        // Legal ball with 0-6
        batsmanRun = parseInt(input) || 0;
      }
  
      // Apply scoring
      if (!match.batsmen[striker]) match.batsmen[striker] = 0;
      if (!match.batsmen[nonStriker]) match.batsmen[nonStriker] = 0;
  
      // Extras
      match.totalRuns += extraRun;
  
      // Batsman run
      if (batsmanRun > 0) {
        match.batsmen[striker] += batsmanRun;
        match.totalRuns += batsmanRun;
      }
  
      // Add to current over events
      over.events.push(input);
  
      // Count legal ball
      if (legalBall) {
        over.balls++;
  
        if (!match.bowlerStats[bowler]) {
          match.bowlerStats[bowler] = { runs: 0, balls: 0, wickets: 0 };
        }
  
        match.bowlerStats[bowler].balls++;
        match.bowlerStats[bowler].runs += (batsmanRun + extraRun);
      }
  
      // Strike rotation
      if (batsmanRun % 2 !== 0) {
        const temp = match.striker;
        match.striker = match.nonStriker;
        match.nonStriker = temp;
      }
  
      // Save and update UI
      gameState.save();
      uiManager.updateUI();
  
      // If 6 legal balls bowled
      if (over.balls === 6) {
        gameState.completeOver(); // rotates strike and resets over
        uiManager.showNextBowlerModal();
      }
    },
  
    handleWicket: function (outPlayer, nextBatsman) {
      const match = gameState.currentMatch;
  
      if (outPlayer === match.striker) {
        match.striker = nextBatsman;
      } else {
        match.nonStriker = nextBatsman;
      }
  
      match.batsmen[nextBatsman] = 0;
  
      // Record wicket to bowler
      if (!match.bowlerStats[match.bowler]) {
        match.bowlerStats[match.bowler] = { runs: 0, balls: 0, wickets: 0 };
      }
      match.bowlerStats[match.bowler].wickets++;
  
      gameState.save();
      uiManager.updateUI();
    },
  
    setNewBowler: function (bowlerName) {
      const match = gameState.currentMatch;
      match.bowler = bowlerName;
      match.currentOver = { balls: 0, events: [] };
      match.totalOvers++;
    },
  
    undoLastBall: function () {
      const match = gameState.currentMatch;
      const over = match.currentOver;
      const lastBall = over.events.pop();
      if (!lastBall) return;
  
      let legalBall = true;
      let runToSubtract = 0;
  
      if (lastBall.startsWith("wd")) {
        legalBall = false;
        runToSubtract = parseInt(lastBall.split('+')[1] || "0") + 1;
      } else if (lastBall.startsWith("nb")) {
        legalBall = false;
        runToSubtract = parseInt(lastBall.split('+')[1] || "0") + 1;
      } else if (lastBall === "W" || lastBall === "wk") {
        legalBall = true;
        match.totalWickets--;
        // Can't automatically undo batsman entry
      } else {
        legalBall = true;
        const runs = parseInt(lastBall) || 0;
        runToSubtract = runs;
        match.batsmen[match.striker] -= runs;
      }
  
      match.totalRuns -= runToSubtract;
  
      if (legalBall) {
        over.balls--;
        match.bowlerStats[match.bowler].balls--;
        match.bowlerStats[match.bowler].runs -= runToSubtract;
      }
  
      gameState.save();
      uiManager.updateUI();
    }
  };