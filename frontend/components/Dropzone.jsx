"use client";

import { useState } from "react";

export default function Dropzone() {
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    setFileName(file.name);

    await uploadFile(file);
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      alert(data.message || "Uploaded!");

    } catch (err) {
      alert("Upload failed: " + err.message);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      style={{
        border: "2px dashed #2563eb",
        padding: "30px",
        borderRadius: "12px",
        textAlign: "center",
        background: dragOver ? "#e0f2fe" : "#f8fafc",
        transition: "0.2s",
        cursor: "pointer"
      }}
    >
      <h3 style={{ marginBottom: 10 }}>Drag & Drop File Here</h3>
      <p style={{ color: "#64748b" }}>
        or click to select a file to upload
      </p>

      <input
        type="file"
        style={{
          opacity: 0,
          width: "100%",
          height: "100%",
          position: "absolute",
          left: 0,
          top: 0,
          cursor: "pointer"
        }}
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            setFileName(file.name);
            uploadFile(file);
          }
        }}
      />

      {fileName && (
        <div style={{ marginTop: 20, fontWeight: 600 }}>
          Uploaded: {fileName}
        </div>
      )}
    </div>
  );
}
