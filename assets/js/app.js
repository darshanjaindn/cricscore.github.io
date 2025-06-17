angular.module('cricketApp', [])
  .controller('ScoringController', function ($scope) {
    const state = GameState.load();

    $scope.ctrl = {
      match: state.matchInfo,
      totalRuns: state.totalRuns,
      wickets: state.wickets,
      oversBowled: state.oversBowled,
      totalOvers: state.totalOvers,
      currentOver: state.currentOver,
      striker: state.striker,
      nonStriker: state.nonStriker,
      bowler: state.bowler,
      onStrike: state.onStrike,
      economy: state.bowlerEconomy[state.bowler] || 0,

      addScore(run) {
        ScoringLogic.recordRun(run);
        UIManager.updateUI($scope);
        GameState.save();
      },

      addExtra(type) {
        ScoringLogic.recordExtra(type);
        UIManager.updateUI($scope);
        GameState.save();
      },

      recordWicket() {
        ScoringLogic.recordWicket();
        UIManager.updateUI($scope);
        GameState.save();
      },

      undo() {
        ScoringLogic.undoLast();
        UIManager.updateUI($scope);
        GameState.save();
      },

      endOver() {
        if (state.ballsInCurrentOver === 6) {
          window.location.href = "start_next_innings.html";
        } else {
          alert("Complete 6 legal deliveries before ending the over.");
        }
      },

      confirmEndInnings() {
        const modal = new bootstrap.Modal(document.getElementById('endInningsModal'));
        modal.show();
      },

      endInnings() {
        GameState.endCurrentInnings();
        window.location.href = "start_next_innings.html";
      }
    };

    UIManager.updateUI($scope);
  });