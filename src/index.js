const config = require('./config');
const logger = require('./logger');
const { parseBalance } = require('./balance');
const { loadState, saveState } = require('./state');
const { focusTab, snapshot, sendMessage } = require('./openclaw');

function formatAmount(amount) {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function buildCrossingMessage({ username, threshold, balance, above }) {
  if (above) {
    return `Alert: ${username} balance is above ${threshold.toLocaleString('en-US')}. Current balance: ${formatAmount(balance)}`;
  }

  return `Recovery: ${username} balance is back to ${threshold.toLocaleString('en-US')} or below. Current balance: ${formatAmount(balance)}`;
}

function main() {
  logger.info('Starting balance check', {
    username: config.username,
    threshold: config.threshold,
    targetTab: config.targetTab,
    statePath: config.statePath
  });

  focusTab(config.targetTab);
  const pageSnapshot = snapshot();
  const balance = parseBalance(pageSnapshot, config.username);

  if (balance == null) {
    throw new Error(`Could not find ${config.username} balance in snapshot output`);
  }

  const previousState = loadState(config.statePath);
  const above = balance > config.threshold;
  const checkedAt = new Date().toISOString();

  if (previousState.lastAbove !== null && previousState.lastAbove !== above) {
    const message = buildCrossingMessage({
      username: config.username,
      threshold: config.threshold,
      balance,
      above
    });

    sendMessage(config.alertChannel, config.alertTarget, message);
    logger.info('Crossing detected, alert sent', { above, balance, target: config.alertTarget });
  } else {
    logger.info('No threshold crossing detected', { above, balance });
  }

  saveState(config.statePath, {
    lastAbove: above,
    lastBalance: balance,
    lastCheckedAt: checkedAt
  });

  logger.info('Balance check completed', {
    username: config.username,
    balance,
    above,
    checkedAt
  });
}

try {
  main();
} catch (error) {
  logger.error('Balance check failed', {
    message: error.message,
    stack: error.stack
  });
  process.exit(1);
}
