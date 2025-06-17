import { getGameState } from './game_state.js';
import jsPDF from 'jspdf';

export function exportScorecardAsPDF() {
    const state = getGameState();
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(`${state.teamA} vs ${state.teamB}`, 20, 20);

    doc.setFontSize(12);
    doc.text(`Total Score: ${state.totalRuns} - ${state.totalWickets} (${state.currentOver}.${state.ballsThisOver})`, 20, 30);

    doc.text(`Batsmen:`, 20, 40);
    let y = 50;
    Object.entries(state.players).forEach(([name, data]) => {
        doc.text(`${name}: ${data.runs}(${data.balls})`, 20, y);
        y += 10;
    });

    y += 10;
    doc.text(`Bowlers:`, 20, y);
    y += 10;
    Object.entries(state.bowlers).forEach(([name, data]) => {
        doc.text(`${name}: ${data.overs} overs, ${data.runs} runs, ${data.wickets} wickets`, 20, y);
        y += 10;
    });

    doc.save(`${state.teamA}_vs_${state.teamB}_scorecard.pdf`);
}