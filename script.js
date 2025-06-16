function checkForm() {
    const host = document.getElementById('hostTeam').value.trim();
    const visitor = document.getElementById('visitorTeam').value.trim();
    const overs = parseInt(document.getElementById('overs').value);
    const tossWinner = document.querySelector('input[name="tossWinner"]:checked');
    const optedTo = document.querySelector('input[name="optedTo"]:checked');

    const startBtn = document.getElementById("startButton");

    if (host && visitor && overs >= 1 && overs <= 50 && tossWinner && optedTo) {
        startBtn.disabled = false;
        startBtn.classList.add("enabled");
    } else {
        startBtn.disabled = true;
        startBtn.classList.remove("enabled");
    }
}

function startMatch() {
    const host = document.getElementById('hostTeam').value.trim();
    const visitor = document.getElementById('visitorTeam').value.trim();
    const overs = parseInt(document.getElementById('overs').value);
    const tossWinner = document.querySelector('input[name="tossWinner"]:checked').value;
    const optedTo = document.querySelector('input[name="optedTo"]:checked').value;

    // Save to localStorage
    localStorage.setItem("hostTeam", host);
    localStorage.setItem("visitorTeam", visitor);
    localStorage.setItem("overs", overs);
    localStorage.setItem("tossWinner", tossWinner);
    localStorage.setItem("optedTo", optedTo);

    // Go to next page
    window.location.href = "player_setup.html";  // (you'll create this next)
}