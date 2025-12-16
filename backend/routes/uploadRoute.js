const express = require("express");
const multer = require("multer");
const { parsePDF } = require("../services/fileParser");
const { storeChunks } = require("../services/ragService");
const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    
    const text = await parsePDF(file.path);

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "No text extracted from PDF" });
    }

    const chunks = [];
    const maxSize = 500;

    for (let i = 0; i < text.length; i += maxSize) {
      chunks.push(text.substring(i, i + maxSize));
    }

    console.log("Chunks created:", chunks.length);

    const { resetCollection, storeChunks } = require("../services/ragService");

// 👇 VERY IMPORTANT
await resetCollection();     // delete old resume
await storeChunks(chunks);   // store new resume only


    res.json({
      message: "File processed and chunks stored successfully",
      extractedText: text.slice(0, 500) + "...",
      chunksStored: chunks.length,
    });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
