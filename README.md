# smart-campus-assistant
Smart Campus Assistant is an AI-powered learning system that enhances the student learning experience by turning static study materials into an interactive and intelligent environment. It acts as a virtual academic companion, helping students understand concepts, revise efficiently, and clear doubts instantly using AI.

🎓 Smart Campus Assistant (RAG System)

An AI-powered learning assistant that allows students to upload documents and ask questions using Retrieval-Augmented Generation (RAG).
It supports offline + online AI models, making it reliable even without internet access.

🚀 Features

📄 Upload documents (PDF, PPT, text)

🔍 Ask questions based only on uploaded content

🧠 RAG pipeline using embeddings + vector search

🔁 Hybrid AI:

Online → Google Gemini

Offline → Ollama (local LLM)

✂️ Document summarization

🕒 Maintains recent Q&A history

🌐 Clean frontend UI with React (Next.js)

🏗️ Project Structure
smart-campus-assistant/
│
├── frontend/          # Next.js frontend
│   ├── app/           # App router pages
│   ├── components/    # UI components
│   ├── lib/           # Helpers (API calls, utils)
│   ├── styles/        # Global & component CSS
│   └── README.md
│
├── backend/           # Node.js backend
│   ├── routes/        # API routes (upload, ask)
│   ├── services/      # RAG, LLM, embedding logic
│   ├── utils/         # Helpers & configs
│   └── README.md
│
└── README.md          # Root documentation

🧠 How It Works (RAG Flow)
Upload Document
      ↓
Text Extraction
      ↓
Embeddings Generation
      ↓
Stored in ChromaDB
      ↓
User Question
      ↓
Relevant Chunks Retrieved
      ↓
LLM (Gemini / Ollama)
      ↓
Final Answer

🔄 Hybrid AI Logic
Condition	Model Used
Internet available	Gemini API
Offline	Ollama (Local LLM)

This ensures:

No dependency on internet

Faster responses locally

Cost-efficient usage

🛠️ Tech Stack
Frontend

Next.js (React)

CSS (custom styling)

Fetch API

Backend

Node.js + Express

ChromaDB (Vector Store)

Ollama (Local LLM)

Google Gemini API

PDF/Text parsing libraries

⚙️ Setup Instructions
1️⃣ Clone Repository
git clone https://github.com/Sanjay-47/smart-campus-assistant.git
cd smart-campus-assistant

2️⃣ Backend Setup
cd backend
npm install
npm start


Make sure Ollama is installed and running locally.

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Open 👉 http://localhost:3000
