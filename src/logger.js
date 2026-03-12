function stamp() {
  return new Date().toISOString();
}

function info(message, meta) {
  if (meta) {
    console.log(`[${stamp()}] INFO ${message}`, meta);
    return;
  }
  console.log(`[${stamp()}] INFO ${message}`);
}

function error(message, meta) {
  if (meta) {
    console.error(`[${stamp()}] ERROR ${message}`, meta);
    return;
  }
  console.error(`[${stamp()}] ERROR ${message}`);
}

module.exports = { info, error };
