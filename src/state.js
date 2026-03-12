const fs = require('fs');
const path = require('path');

function loadState(statePath) {
  try {
    return JSON.parse(fs.readFileSync(statePath, 'utf8'));
  } catch {
    return { lastAbove: null, lastBalance: null, lastCheckedAt: null };
  }
}

function saveState(statePath, state) {
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
}

module.exports = {
  loadState,
  saveState
};
