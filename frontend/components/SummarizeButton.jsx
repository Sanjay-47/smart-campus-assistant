"use client";
import { useState } from "react";

export default function SummarizeButton({ onResult }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const run = async () => {
    setErr(""); 
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/rag/summarize", {
        method: "POST"
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      onResult?.(data.summary);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 3 }}>
      <button
        onClick={run}
        disabled={loading}
        style={{
          padding: "10px 20px",
          borderRadius: 10,
          background: loading ? "#93c5fd" : "#16a34a",
          color: "white",
          border: "none",
          fontWeight: 600,
          cursor: "pointer"
        }}
      >
        {loading ? "Summarizing..." : "Summarize Document"}
      </button>

      {err && (
        <div style={{ color: "red", marginTop: 10 }}>
          {err}
        </div>
      )}
    </div>
  );
}
