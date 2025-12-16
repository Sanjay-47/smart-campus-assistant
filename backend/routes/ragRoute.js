const express = require("express");
const router = express.Router();
const { queryChunks, client } = require("../services/ragService");

const { hasInternet } = require("../utils/network");


router.post("/ask", async (req, res) => {
  console.log("GEMINI KEY EXISTS:", !!process.env.GEMINI_API_KEY);

  try {
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({ answer: "Query cannot be empty" });
    }

    // 1️⃣ RAG
    const result = await queryChunks(query);
    const documents = result.documents?.[0] || [];

    if (!documents.length) {
      return res.json({ answer: "No relevant information found in document." });
    }

    // 2️⃣ Sanitize and truncate context
    const context = documents
      .join("\n")
      .replace(/["'•]/g, "")   // remove quotes and bullets
      .replace(/\s+/g, " ")   // collapse multiple spaces
      .slice(0, 3000);        // truncate to safe length

    const online = await hasInternet();

   
if (online) {
  const GEMINI_MODEL = "gemini-2.5-flash";// ✅ Use the modern model
  const API_KEY = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
You are an academic assistant.
Answer ONLY using the document below.
If the answer is not found, say "Information not found in document".

DOCUMENT:
${context}

QUESTION:
${query}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    
    // Log error if Gemini fails (e.g., safety filters)
    if (data.error) {
      console.error("Gemini API Error:", data.error);
      return res.json({ answer: "Error contacting Gemini API." });
    }

    // ✅ Extract answer correctly for Gemini 1.5
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
    
    return res.json({ answer: answer.trim() });

  } catch (error) {
    console.error("Fetch Error:", error);
    // Fallback to Ollama if fetch fails completely
  }
}

    // 4️⃣ Ollama (Offline fallback)
    const ollamaRes = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.1:latest",
        stream: false,
        messages: [
          { role: "system", content: "Answer using ONLY the provided context." },
          { role: "user", content: `Context:\n${context}\n\nQuestion: ${query}` }
        ]
      })
    }).then(r => r.json());

    const answer =
      typeof ollamaRes?.message?.content === "string"
        ? ollamaRes.message.content
        : "No response from Ollama";

    res.json({ answer });

  } catch (err) {
    console.error("ASK ERROR:", err);
    res.status(500).json({ answer: "Internal server error" });
  }
});

router.get("/test-chunks", async (req, res) => {
  try {
    const collection = await client.getOrCreateCollection({
      name: "documents_local"
    });

    const count = await collection.count();
    res.json({ success: true, chunksStored: count });

  } catch (err) {
    res.status(500).json({ success: false, error: "Unable to check chunk count" });
  }
});

router.post("/summarize", async (req, res) => {
  try {
    const collection = await client.getOrCreateCollection({ name: "documents_local" });

    const result = await collection.get();
    const allDocs = result.documents.flat().join("\n");

    if (!allDocs) {
      return res.status(404).json({ error: "No documents found" });
    }

    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.1",
        stream: false,
        messages: [
          { role: "system", content: "Summarize the provided text." },
          { role: "user", content: allDocs }
        ]
      })
    }).then(r => r.json());

    res.json({ summary: response?.message?.content || response });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});



router.post("/quiz", async (req, res) => {
  try {
    const collection = await client.getOrCreateCollection({ name: "documents_local" });

    const result = await collection.get();
    const documents = result.documents?.flat() || [];

    if (documents.length === 0) {
      return res.status(400).json({ error: "No document context stored. Upload a PDF first." });
    }

    let context = documents.join("\n");

    // 🔥 LIMIT CONTEXT SO MODEL NEVER FAILS
    const limitedContext = context.slice(0, 4000);

    const strictPrompt = `
You MUST generate a quiz ONLY from the provided document context.

STRICT RULES:
- Output MUST be valid JSON ONLY.
- EXACTLY 5 MCQs (question, options[], answer)
- EXACTLY 5 short questions (question, answer)
- NO markdown, NO explanation
Format:
{
  "mcqs": [
    { "question": "", "options": ["A","B","C","D"], "answer": "" }
  ],
  "short": [
    { "question": "", "answer": "" }
  ]
}
    `;

    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.1:latest",
        stream: false,
        messages: [
          { role: "system", content: "Output ONLY valid JSON." },
          { role: "user", content: `Context:\n${limitedContext}\n\n${strictPrompt}` }
        ]
      })
    }).then(r => r.json());

    res.json({
      quiz: response?.message?.content || "{}"
    });

  } catch (err) {
    console.error("QUIZ ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});




module.exports = router;
