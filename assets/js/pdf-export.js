function exportToPDF() {
    const doc = new jsPDF();
    const summaryHTML = SummaryGenerator.generateHTMLSummary();
    doc.text("Cricket Match Summary", 10, 10);
    doc.fromHTML(summaryHTML, 10, 20);
    doc.save("match-summary.pdf");
  }