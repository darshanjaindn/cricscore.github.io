// scoring_logic.js

import { gameState } from './game_state.js';
import { updateBatsmenDisplay } from './ui_manager.js';

const ScoringLogic = {
    addRun(run) {
      const inning = GameState.data.innings - 1;
      GameState.data.score[inning] += run;
      GameState.data.balls++;
  
      if (run % 2 === 1) this.swapStrike();
      this.recordBall(run);
  
      if (GameState.data.balls % 6 === 0) {
        UIManager.promptNewBowler();
      }
  
      GameState.data.lastAction = { type: 'run', value: run };
      GameState.save();
    },
  
    wicket() {
      const inning = GameState.data.innings - 1;
      GameState.data.wickets[inning]++;
      this.recordBall('W');
  
      GameState.data.lastAction = { type: 'wicket' };
      GameState.save();
    },
  
    swapStrike() {
      [GameState.data.striker, GameState.data.nonStriker] =
        [GameState.data.nonStriker, GameState.data.striker];
    },
  
    recordBall(info) {
      const inning = GameState.data.innings - 1;
      GameState.data.currentOver.push(info);
  
      if (GameState.data.currentOver.length === 6) {
        GameState.data.overs[inning].push({
          bowler: GameState.data.currentBowler,
          balls: [...GameState.data.currentOver]
        });
        GameState.data.currentOver = [];
      }
    },
  
    undo() {
      const last = GameState.data.lastAction;
      if (!last) return;
  
      if (last.type === 'run') {
        const run = last.value;
        const inning = GameState.data.innings - 1;
        GameState.data.score[inning] -= run;
        GameState.data.balls--;
  
        if (run % 2 === 1) this.swapStrike();
        GameState.data.currentOver.pop();
      } else if (last.type === 'wicket') {
        GameState.data.wickets[GameState.data.innings - 1]--;
        GameState.data.currentOver.pop();
      }
  
      GameState.data.lastAction = null;
      GameState.save();
    }
  };

export function handleRun(runScored) {
    // Update score for striker
    const striker = gameState.striker;
    if (!gameState.batsmenStats[striker]) {
      gameState.batsmenStats[striker] = { runs: 0, balls: 0 };
    }
    gameState.batsmenStats[striker].runs += runScored;
    gameState.batsmenStats[striker].balls += 1;
  
    // Strike change if run is odd
    if (runScored % 2 === 1) {
      [gameState.striker, gameState.nonStriker] = [gameState.nonStriker, gameState.striker];
    }
  
    updateBatsmenDisplay();
  }