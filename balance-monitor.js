const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const USERNAME = 'replace-me';
const THRESHOLD = 50000;
const STATE_PATH = path.join(__dirname, 'state', 'balance-state.json');
const TARGET_TAB = 'REPLACE_WITH_BROWSER_TAB_ID';
const ALERT_CHANNEL = 'telegram';
const ALERT_TARGET = '@replace_me';

function run(cmd, args) {
  return execFileSync(cmd, args, { encoding: 'utf8' });
}

function parseSnapshot(text) {
  const rowRe = new RegExp(`row \"${USERNAME} ([0-9,]+(?:\\.[0-9]+)?)\"`);
  const m = text.match(rowRe);
  if (!m) return null;
  return Number(m[1].replace(/,/g, ''));
}

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
  } catch {
    return { lastAbove: null, lastBalance: null, lastCheckedAt: null };
  }
}

function saveState(state) {
  fs.mkdirSync(path.dirname(STATE_PATH), { recursive: true });
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

function sendAlert(message) {
  run('openclaw', ['message', 'send', '--channel', ALERT_CHANNEL, '--target', ALERT_TARGET, '--message', message]);
}

function main() {
  run('openclaw', ['browser', '--browser-profile', 'chrome', 'focus', TARGET_TAB]);
  const snapshot = run('openclaw', ['browser', '--browser-profile', 'chrome', 'snapshot']);
  const balance = parseSnapshot(snapshot);
  if (balance == null) throw new Error(`Could not find ${USERNAME} balance on snapshot output`);

  const state = loadState();
  const above = balance > THRESHOLD;
  const now = new Date().toISOString();

  if (state.lastAbove !== null && state.lastAbove !== above) {
    if (above) {
      sendAlert(`Alert: ${USERNAME} balance is above ${THRESHOLD.toLocaleString('en-US')}. Current balance: ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    } else {
      sendAlert(`Recovery: ${USERNAME} balance is back to ${THRESHOLD.toLocaleString('en-US')} or below. Current balance: ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    }
  }

  saveState({ lastAbove: above, lastBalance: balance, lastCheckedAt: now });
  console.log(JSON.stringify({ ok: true, username: USERNAME, balance, above, threshold: THRESHOLD, checkedAt: now }, null, 2));
}

main();
