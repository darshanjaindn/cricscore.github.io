import { getGameState } from './game_state.js';

export function generateMatchSummary() {
    const state = getGameState();

    let summaryHTML = `<h2>${state.teamA} vs ${state.teamB}</h2>`;
    summaryHTML += `<p>Total Score: ${state.totalRuns} - ${state.totalWickets} (${state.currentOver}.${state.ballsThisOver})</p>`;

    summaryHTML += `<h3>Batsmen</h3><table><tr><th>Name</th><th>R</th><th>B</th></tr>`;
    Object.entries(state.players).forEach(([name, data]) => {
        summaryHTML += `<tr><td>${name}</td><td>${data.runs}</td><td>${data.balls}</td></tr>`;
    });
    summaryHTML += `</table>`;

    summaryHTML += `<h3>Bowlers</h3><table><tr><th>Name</th><th>O</th><th>R</th><th>W</th></tr>`;
    Object.entries(state.bowlers).forEach(([name, data]) => {
        summaryHTML += `<tr><td>${name}</td><td>${data.overs}</td><td>${data.runs}</td><td>${data.wickets}</td></tr>`;
    });
    summaryHTML += `</table>`;

    document.getElementById("summarySection").innerHTML = summaryHTML;
}