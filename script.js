function checkForm() {
    const a = document.getElementById("teamA").value.trim();
    const b = document.getElementById("teamB").value.trim();
    const overs = parseInt(document.getElementById("overs").value);
    const toss = document.querySelector('input[name="toss"]:checked');
    const opt = document.querySelector('input[name="opt"]:checked');
  
    const btn = document.getElementById("startMatch");
  
    if (a && b && toss && opt && overs >= 1 && overs <= 50) {
      btn.disabled = false;
      btn.classList.add("enabled");
    } else {
      btn.disabled = true;
      btn.classList.remove("enabled");
    }
  }
  
  function startMatch() {
    const a = document.getElementById("teamA").value.trim();
    const b = document.getElementById("teamB").value.trim();
    const overs = parseInt(document.getElementById("overs").value);
    const toss = document.querySelector('input[name="toss"]:checked').value;
    const opt = document.querySelector('input[name="opt"]:checked').value;
  
    localStorage.setItem("teamA", a);
    localStorage.setItem("teamB", b);
    localStorage.setItem("overs", overs);
    localStorage.setItem("tossWinner", toss);
    localStorage.setItem("optedTo", opt);
  
    window.location.href = "player_setup.html";  // next page
  }