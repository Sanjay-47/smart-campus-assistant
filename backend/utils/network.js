const dns = require("dns").promises;

async function hasInternet() {
  try {
    await dns.lookup("google.com");
    return true;
  } catch {
    return false;
  }
}

module.exports = { hasInternet };
