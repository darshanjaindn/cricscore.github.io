// scoring_logic.js

import { gameState } from './game_state.js';
import { updateBatsmenDisplay } from './ui_manager.js';

const ScoringLogic = {
    addRun(run) {
        const inning = gameState.innings - 1;
        gameState.score[inning] += run;
        gameState.balls++;

        if (run === 1) this.swapStrike();
        this.recordBall(run)

        if (run % 2 === 1) this.swapStrike();
        this.recordBall(run);

        if (gameState.balls % 6 === 0) {
            UIManager.promptNewBowler();
        }

        gameState.lastAction = { type: 'run', value: run };
        gameState.save();
    },

    wicket() {
        const inning = gameState.innings - 1;
        gameState.wickets[inning]++;
        this.recordBall('W');

        gameState.lastAction = { type: 'wicket' };
        gameState.save();
    },

    swapStrike() {
        [gameState.striker, gameState.nonStriker] = [gameState.nonStriker, gameState.striker];
    },

    recordBall(info) {
        const inning = gameState.innings - 1;
        gameState.currentOver.push(info);

        if (gameState.currentOver.length === 6) {
            gameState.overs[inning].push({
                bowler: gameState.currentBowler,
                balls: [...gameState.currentOver]
            });
            gameState.currentOver = [];
        }
    },

    undo() {
        const last = gameState.lastAction;
        if (!last) return;

        if (last.type === 'run') {
            const run = last.value;
            const inning = gameState.innings - 1;
            gameState.score[inning] -= run;
            gameState.balls--;

            if (run % 2 === 1) this.swapStrike();
            gameState.currentOver.pop();
        } else if (last.type === 'wicket') {
            gameState.wickets[gameState.innings - 1]--;
            gameState.currentOver.pop();
        }

        gameState.lastAction = null;
        gameState.save();
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

// Update the UI to reflect the current striker
export function updateBatsmenDisplay() {
    const striker = gameState.striker;
    const nonStriker = gameState.nonStriker;

    // Assuming you have elements with IDs 'striker' and 'nonStriker' to display the batsmen
    document.getElementById('striker').innerText = `${gameState.batsmen[striker]} *`;
    document.getElementById('nonStriker').innerText = gameState.batsmen[nonStriker];
}