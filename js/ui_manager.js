import { gameState } from './game_state.js';

const UIManager = {
  init() {
    document.getElementById("undo-btn").addEventListener("click", () => {
      ScoringLogic.undo();
      this.render();
    });

    document.getElementById("end-innings-btn").addEventListener("click", () => {
      this.endInnings();
    });

    document.getElementById("export-pdf-btn").addEventListener("click", () => {
      SummaryGenerator.exportPDF();
    });

    this.render();
  },

  render() {
    const container = document.getElementById("match-container");
    const data = gameState.data;

    container.innerHTML = `
      <h2>${data.teams[0]} vs ${data.teams[1]}</h2>
      <p>Innings: ${data.innings}</p>
      <p>Score: ${data.score[data.innings - 1]} / ${data.wickets[data.innings - 1]}</p>
      <p>Striker: ${data.striker} *</p>
      <p>Non-Striker: ${data.nonStriker}</p>
      <p>Bowler: ${data.currentBowler}</p>
      <p>Over: ${data.currentOver.join(", ")}</p>
    `;
  },

  promptNewBowler() {
    const name = prompt("Enter new bowler name:");
    if (name) {
      gameState.data.currentBowler = name;
      gameState.data.bowlers[gameState.data.innings - 1].push(name);
      gameState.save();
      this.render();
    }
  },

  endInnings() {
    if (gameState.data.innings === 1) {
      gameState.data.innings = 2;
      gameState.data.balls = 0;
      gameState.data.currentOver = [];
      alert("Innings over. Enter new striker, non-striker and bowler.");
    } else {
      this.endMatch();
    }
    gameState.save();
    this.render();
  },

  endMatch() {
    const [score1, score2] = gameState.data.score;
    if (score1 > score2) {
      gameState.data.winner = gameState.data.teams[0];
    } else if (score2 > score1) {
      gameState.data.winner = gameState.data.teams[1];
    } else {
      gameState.data.winner = "Tie";
    }
    alert(`Match Over! Winner: ${gameState.data.winner}`);
  }
};

export function updateBatsmenDisplay() {
  const striker = gameState.striker;
  const nonStriker = gameState.nonStriker;

  document.getElementById('striker-name').innerText = `Striker: ${striker}*`;
  document.getElementById('non-striker-name').innerText = `Non-Striker: ${nonStriker}`;
}
