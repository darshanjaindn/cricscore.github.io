const SummaryGenerator = (function () {

    function formatBatsmanStats(batsmen) {
      let html = `
        <table class="table table-sm table-bordered text-center">
          <thead class="table-light">
            <tr>
              <th>Batsman</th>
              <th>Runs</th>
              <th>Balls</th>
              <th>4s</th>
              <th>6s</th>
              <th>SR</th>
            </tr>
          </thead>
          <tbody>`;
  
      for (let [name, stats] of Object.entries(batsmen)) {
        const sr = stats.balls ? ((stats.runs / stats.balls) * 100).toFixed(1) : "0.0";
        html += `<tr>
          <td>${name}${stats.striker ? " *" : ""}</td>
          <td>${stats.runs}</td>
          <td>${stats.balls}</td>
          <td>${stats.fours}</td>
          <td>${stats.sixes}</td>
          <td>${sr}</td>
        </tr>`;
      }
  
      html += `</tbody></table>`;
      return html;
    }
  
    function formatBowlerStats(bowlers) {
      let html = `
        <table class="table table-sm table-bordered text-center mt-3">
          <thead class="table-light">
            <tr>
              <th>Bowler</th>
              <th>Overs</th>
              <th>Runs</th>
              <th>Wkts</th>
              <th>Eco</th>
            </tr>
          </thead>
          <tbody>`;
  
      for (let [name, stats] of Object.entries(bowlers)) {
        const overs = Math.floor(stats.balls / 6) + '.' + (stats.balls % 6);
        const eco = stats.balls ? ((stats.runs / stats.balls) * 6).toFixed(2) : "0.00";
        html += `<tr>
          <td>${name}</td>
          <td>${overs}</td>
          <td>${stats.runs}</td>
          <td>${stats.wickets}</td>
          <td>${eco}</td>
        </tr>`;
      }
  
      html += `</tbody></table>`;
      return html;
    }
  
    function formatExtrasAndTotal(state) {
      const overs = Math.floor(state.totalBalls / 6) + '.' + (state.totalBalls % 6);
      return `
        <p><strong>Extras:</strong> ${state.extras || 0}</p>
        <p><strong>Total:</strong> ${state.totalRuns}/${state.wickets} in ${overs} overs</p>
      `;
    }
  
    function formatFallOfWickets(state) {
      if (!state.fallOfWickets || state.fallOfWickets.length === 0) return '';
      return `
        <p><strong>Fall of Wickets:</strong> ${state.fallOfWickets.join(', ')}</p>
      `;
    }
  
    function generateHTMLSummary(matchObj = null) {
      const state = matchObj || GameState.load();
  
      let summary = `
        <div class="text-start">
          ${formatExtrasAndTotal(state)}
          ${formatFallOfWickets(state)}
          <h5 class="mt-4">Batsmen</h5>
          ${formatBatsmanStats(state.batsmen)}
          <h5 class="mt-4">Bowlers</h5>
          ${formatBowlerStats(state.bowlers)}
        </div>
      `;
  
      return summary;
    }
  
    return {
      generateHTMLSummary
    };
  })();