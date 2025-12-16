const fs = require("fs");
const pdf = require("pdf-extraction");

async function parsePDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(filePath);
  return data.text;
}

module.exports = { parsePDF };
