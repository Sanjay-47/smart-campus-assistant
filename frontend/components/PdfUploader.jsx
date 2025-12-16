'use client'
import { useState } from 'react'
import { uploadPdf } from '../lib/api'

export default function PdfUploader() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')
  const [dragOver, setDragOver] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    if (!file) return setStatus('Choose a file')
    setStatus('Uploading...')

    try {
      const res = await uploadPdf(file)
      setStatus(res.message || 'Uploaded')
    } catch (err) {
      setStatus('Upload failed: ' + (err.message || err))
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)

    const dropped = e.dataTransfer.files?.[0]
    if (dropped) {
      setFile(dropped)
      setStatus(`Selected: ${dropped.name}`)
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>

      {/* Dropzone Box */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          padding: 30,
          border: '2px dashed #2563eb',
          borderRadius: 12,
          textAlign: 'center',
          background: dragOver ? '#e0f2fe' : '#f8fafc',
          transition: '0.2s',
          cursor: 'pointer'
        }}
        onClick={() => document.getElementById('pdfInput').click()}
      >
        <h3>Drag & Drop PDF Here</h3>
        <p style={{ color: '#64748b' }}>or click to select</p>
      </div>

      {/* Hidden Real File Input */}
      <input
        id="pdfInput"
        type="file"
        accept="application/pdf"
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) {
            setFile(f)
            setStatus(`Selected: ${f.name}`)
          }
        }}
      />

      <button type="submit">Upload PDF</button>

      <div style={{ marginTop: 8 }}>{status}</div>
    </form>
  )
}
