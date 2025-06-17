import { saveGameState, getGameState } from './game_state.js';
import { updateUI } from './ui_manager.js';

export function handleBall(event) {
    const state = getGameState();

    const ball = event.ball;
    const extras = event.extras || {};
    const isWicket = event.wicket || false;

    let striker = state.striker;
    let nonStriker = state.nonStriker;
    let bowler = state.currentBowler;

    // Extras handling
    let isLegal = true;
    let runScored = 0;
    let overBall = "";

    if (extras.wide || extras.noBall) {
        isLegal = false;
        runScored += 1;
        overBall = extras.wide ? "wd" : "nb";
        if (extras.bonus) {
            runScored += parseInt(extras.bonus);
            overBall += `+${extras.bonus}`;
        }
        state.extras += runScored;
    } else {
        runScored += parseInt(ball);
        overBall = runScored.toString();
        state.ballsThisOver++;
    }

    // Record run and rotate strike
    if (!extras.wide && !extras.noBall && !isWicket) {
        state.players[striker].runs += runScored;
        state.players[striker].balls += 1;

        if ([1, 3, 5].includes(runScored)) {
            [state.striker, state.nonStriker] = [state.nonStriker, state.striker];
        }
    }

    // Wicket handling
    if (isWicket) {
        state.players[striker].balls += 1;
        state.players[striker].isOut = true;
        state.totalWickets++;
        overBall = "wk";
    }

    // Over and bowler tracking
    state.totalRuns += runScored;
    state.overs[state.currentOver].push(overBall);
    state.bowlers[bowler].runs += runScored;
    if (isWicket) state.bowlers[bowler].wickets++;
    if (isLegal) state.bowlers[bowler].balls++;

    // Check over completion
    if (state.ballsThisOver === 6) {
        state.bowlers[bowler].overs++;
        state.ballsThisOver = 0;
        state.currentOver++;
        state.overs[state.currentOver] = [];
        state.promptNewBowler = true;
    }

    saveGameState(state);
    updateUI();
}

export function undoLastBall() {
    const state = getGameState();
    const over = state.overs[state.currentOver];
    if (!over || over.length === 0) return;

    const last = over.pop();
    // You can add full undo logic here (track full history)

    saveGameState(state);
    updateUI();
}