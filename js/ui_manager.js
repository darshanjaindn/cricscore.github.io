import { getGameState } from './game_state.js';

export function updateUI() {
    const state = getGameState();
    
    document.getElementById("teamScore").innerText = `${state.totalRuns} - ${state.totalWickets} (${state.currentOver}.${state.ballsThisOver})`;

    let batsmanTable = "";
    Object.entries(state.players).forEach(([name, data]) => {
        let star = (name === state.striker) ? "*" : "";
        batsmanTable += `${name}${star} ${data.runs}(${data.balls}) | `;
    });

    document.getElementById("batsmenInfo").innerText = batsmanTable;

    let overStr = state.overs[state.currentOver].join(", ");
    document.getElementById("thisOver").innerText = overStr;
}