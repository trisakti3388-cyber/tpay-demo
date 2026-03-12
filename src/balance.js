function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseBalance(snapshotText, username) {
  const rowRe = new RegExp(`row \"${escapeRegExp(username)} ([0-9,]+(?:\\.[0-9]+)?)\"`);
  const match = snapshotText.match(rowRe);
  if (!match) return null;
  return Number(match[1].replace(/,/g, ''));
}

module.exports = {
  parseBalance
};
