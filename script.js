function checkForm() {
    const teamA = document.getElementById("teamA").value.trim();
    const teamB = document.getElementById("teamB").value.trim();
    const overs = parseInt(document.getElementById("overs").value);
    const toss = document.querySelector('input[name="toss"]:checked');
    const opt = document.querySelector('input[name="opt"]:checked');
  
    // Update radio labels dynamically
    document.getElementById("labelA").innerText = teamA || "Host Team";
    document.getElementById("labelB").innerText = teamB || "Visitor Team";
  
    const btn = document.getElementById("startMatch");
    if (teamA && teamB && toss && opt && overs >= 1 && overs <= 50) {
      btn.disabled = false;
      btn.classList.add("enabled");
    } else {
      btn.disabled = true;
      btn.classList.remove("enabled");
    }
  }