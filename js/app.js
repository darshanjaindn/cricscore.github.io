import { gameState } from './game_state.js';
import { updateBatsmenDisplay } from './ui_manager.js';

function startMatch(striker, nonStriker) {
  gameState.striker = striker;
  gameState.nonStriker = nonStriker;
  updateBatsmenDisplay();
}

// Save state every update
function saveState() {
    localStorage.setItem('matchState', JSON.stringify(gameState));
  }
  

  // Restore state on page load
function loadState() {
    const data = localStorage.getItem('matchState');
    if (data) {
      Object.assign(gameState, JSON.parse(data));
      updateBatsmenDisplay();
    }
  }