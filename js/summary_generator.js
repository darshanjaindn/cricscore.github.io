// summary_generator.js
const SummaryGenerator = {
    exportPDF() {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
  
      const data = GameState.data;
      doc.setFontSize(14);
      doc.text(`${data.teams[0]} vs ${data.teams[1]}`, 20, 20);
  
      doc.text(`Score Innings 1: ${data.score[0]} / ${data.wickets[0]}`, 20, 30);
      doc.text(`Score Innings 2: ${data.score[1]} / ${data.wickets[1]}`, 20, 40);
      doc.text(`Winner: ${data.winner || "Match in Progress"}`, 20, 50);
  
      let y = 60;
      data.overs.forEach((overs, i) => {
        doc.text(`Innings ${i + 1} Overs:`, 20, y);
        y += 10;
        overs.forEach(o => {
          doc.text(`${o.bowler}: ${o.balls.join(", ")}`, 30, y);
          y += 10;
        });
      });
  
      doc.save("match_summary.pdf");
    }
  };