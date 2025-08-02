const fs = require('fs');
const path = require('path');

const mochawesomeReportPath = path.join(__dirname, 'cypress/reports/merged-report.json');
const outputPath = path.join(__dirname, 'cypress/reports/cypress-playground.json');

function extractSummary(report) {
  const { stats, results } = report;

  return {
    summary: {
      totalTests: stats.tests,
      passes: stats.passes,
      failures: stats.failures,
      duration: stats.duration,
      start: stats.start,
      end: stats.end,
    },
    suites: results.map((suite) => ({
      file: suite.file,
      title: suite.suites[0]?.title,
      tests: suite.suites[0]?.tests.map((t) => ({
        title: Array.isArray(t.title) ? t.title.join(' ') : t.title,
        state: t.state,
        duration: t.duration,
        error: t.err?.message || null,
      })),
    })),
  };
}


try {
  const reportData = JSON.parse(fs.readFileSync(mochawesomeReportPath, 'utf-8'));
  const summary = extractSummary(reportData);
  fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2));
  console.log('✅ cypress-playground.json generated');
} catch (error) {
  console.error('❌ Failed to generate cypress-playground.json:', error.message);
  process.exit(1);
}
