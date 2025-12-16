export async function uploadPdf(file){
  const form = new FormData();
  form.append('file', file);
  const res = await fetch('http://localhost:5000/api/upload', { method:'POST', body: form });
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function askQuestion(message){
  const res = await fetch('http://localhost:5000/api/rag/ask', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ message })   // <<-- IMPORTANT: backend expects { message }
  });
  const data = await res.json();
  if(!res.ok) throw new Error(data?.error || JSON.stringify(data));
  return data;
}
