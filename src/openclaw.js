const { execFileSync } = require('child_process');

function runOpenClaw(args) {
  return execFileSync('openclaw', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  });
}

function focusTab(targetTab) {
  return runOpenClaw(['browser', '--browser-profile', 'chrome', 'focus', targetTab]);
}

function snapshot() {
  return runOpenClaw(['browser', '--browser-profile', 'chrome', 'snapshot']);
}

function sendMessage(channel, target, message) {
  return runOpenClaw([
    'message',
    'send',
    '--channel',
    channel,
    '--target',
    target,
    '--message',
    message
  ]);
}

module.exports = {
  focusTab,
  snapshot,
  sendMessage
};
