"use client";

import React, { useState, useRef } from "react";
import SummarizeButton from "./SummarizeButton";

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const inputRef = useRef(null);

  const send = async () => {
    const trimmed = message.trim();
    if (!trimmed) {
      setError("Query cannot be empty");
      return;
    }

    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const res = await fetch("http://localhost:5000/api/rag/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.answer || "Request failed");

      const finalText =
        typeof data.answer === "string"
          ? data.answer
          : "No answer received";

      setAnswer(finalText);
      setHistory((prev) => [{ q: trimmed, a: finalText }, ...prev]);
      setMessage("");
    } catch (err) {
      setError(typeof err.message === "string" ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) send();
    }
  };

  return (
    <div style={{
      display: "grid",
      gap: 16,
      maxWidth: 820,
      margin: "20px auto",
      padding: 20,
      background: "#f9fafb",
      borderRadius: 12
    }}>
      <label style={{ fontWeight: 700 }}>Ask the document</label>

      <textarea
        ref={inputRef}
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your question..."
        style={{
          padding: 14,
          borderRadius: 10,
          border: "1px solid #d1d5db",
          fontSize: 15
        }}
      />

     <div className="chat-actions">
  <button
    onClick={send}
    disabled={loading}
    className="chat-btn ask"
  >
    {loading ? "Thinking..." : "Ask"}
  </button>

  <button
    onClick={() => {
      setMessage("");
      setAnswer("");
      setError("");
    }}
    className="chat-btn clear"
  >
    Clear
  </button>

  <SummarizeButton onResult={(summary) => setAnswer(summary)} />
</div>


      {error && <div style={{ color: "red" }}>{error}</div>}

      <pre style={{
        whiteSpace: "pre-wrap",
        background: "#f3f4f6",
        padding: 12,
        borderRadius: 8
      }}>
        {loading ? "Thinking..." : answer || "No answer yet"}
      </pre>

      <div>
        <h4>Recent Questions</h4>
        {history.map((h, i) => (
          <div key={i}>
            <strong>{h.q}</strong>
            <p>{h.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
