let runs = 0;
let wickets = 0;

window.onload = function () {
    // Load saved player names
    if (localStorage.getItem("player1")) {
        document.getElementById("player1").value = localStorage.getItem("player1");
    }
    if (localStorage.getItem("player2")) {
        document.getElementById("player2").value = localStorage.getItem("player2");
    }
    updateScore();
}

function savePlayers() {
    let p1 = document.getElementById("player1").value;
    let p2 = document.getElementById("player2").value;
    localStorage.setItem("player1", p1);
    localStorage.setItem("player2", p2);
    alert("Players saved!");
}

function addRun(r) {
    runs += r;
    updateScore();
}

function addWicket() {
    wickets++;
    updateScore();
}

function updateScore() {
    document.getElementById("score").innerText = `${runs}/${wickets}`;
}

function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let p1 = localStorage.getItem("player1") || "Player 1";
    let p2 = localStorage.getItem("player2") || "Player 2";

    doc.text("Cricket Match Summary", 20, 20);
    doc.text(`Player 1: ${p1}`, 20, 30);
    doc.text(`Player 2: ${p2}`, 20, 40);
    doc.text(`Final Score: ${runs}/${wickets}`, 20, 50);

    doc.save("match_summary.pdf");
}