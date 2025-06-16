// ui_manager.js
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
      const data = GameState.data;
  
      container.innerHTML = `
        <h2>${data.teams[0]} vs ${data.teams[1]}</h2>
        <p>Innings: ${data.innings}</p>
        <p>Score: ${data.score[data.innings - 1]} / ${data.wickets[data.innings - 1]}</p>
        <p>Striker: ${data.striker} * </p>
        <p>Non-Striker: ${data.nonStriker}</p>
        <p>Bowler: ${data.currentBowler}</p>
        <p>Over: ${data.currentOver.join(", ")}</p>
      `;
    },
  
    promptNewBowler() {
      const name = prompt("Enter new bowler name:");
      if (name) {
        GameState.data.currentBowler = name;
        GameState.data.bowlers[GameState.data.innings - 1].push(name);
        GameState.save();
        this.render();
      }
    },
  
    endInnings() {
      if (GameState.data.innings === 1) {
        GameState.data.innings = 2;
        GameState.data.balls = 0;
        GameState.data.currentOver = [];
        alert("Innings over. Enter new striker, non-striker and bowler.");
      } else {
        this.endMatch();
      }
      GameState.save();
      this.render();
    },
  
    endMatch() {
      const [score1, score2] = GameState.data.score;
      if (score1 > score2) {
        GameState.data.winner = GameState.data.teams[0];
      } else if (score2 > score1) {
        GameState.data.winner = GameState.data.teams[1];
      } else {
        GameState.data.winner = "Tie";
      }
      alert(`Match Over! Winner: ${GameState.data.winner}`);
    }
  };


export function updateBatsmenDisplay() {
    const striker = gameState.striker;
    const nonStriker = gameState.nonStriker;
  
    document.getElementById('striker-name').innerText = `Striker: ${striker} *`;
    document.getElementById('non-striker-name').innerText = `Non-Striker: ${nonStriker}`;
  }