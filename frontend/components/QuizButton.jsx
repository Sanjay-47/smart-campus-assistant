"use client";

import { useState } from "react";

export default function QuizButton({ onQuiz }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const generateQuiz = async () => {
    setErr(""); 
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/rag/quiz", {
        method: "POST"
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      let quizText = data.quiz;

      // Remove markdown wrappers if present
      quizText = quizText.replace(/```json|```/g, "").trim();

      let parsedQuiz;

      try {
        parsedQuiz = JSON.parse(quizText);
      } catch (e) {
        console.error("Quiz JSON Parse Error:", quizText);
        parsedQuiz = { raw: quizText };
      }

      onQuiz?.(parsedQuiz);

    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={generateQuiz} disabled={loading} style={{ padding: "10px 18px", borderRadius: 10 }}>
        {loading ? "Generating..." : "Generate Quiz"}
      </button>

      {err && <div style={{ color: "red" }}>{err}</div>}
    </div>
  );
}
