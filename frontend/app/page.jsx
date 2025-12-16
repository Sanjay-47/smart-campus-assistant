'use client';
import { useState } from "react";
import Link from "next/link";


export default function Home() {
const [menuOpen, setMenuOpen] = useState(false);


return (
<div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
{/* Navbar */}
<nav className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50 backdrop-blur-md sticky top-0 z-10">
<h1 className="text-2xl font-bold tracking-wide">RAG System</h1>

<div className={`md:flex gap-6 text-lg ${menuOpen ? "block mt-4" : "hidden md:block"}`}>
<Link href="/upload" className="hover:text-blue-400 transition">Upload</Link>
<Link href="/ask" className="hover:text-blue-400 transition">Ask</Link>
</div>
</nav>


{/* Hero Section */}
<section className="text-center py-28 px-6">
<h2 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
Upload → Embed → Ask
</h2>
<p className="text-gray-300 max-w-2xl mx-auto text-lg">
Smart offline AI-powered search for your documents. Powered by <span className="text-blue-400 font-semibold">Ollama</span> + <span className="text-purple-400 font-semibold">ChromaDB</span>.
</p>


<div className="mt-10 flex justify-center gap-6">
<Link href="/upload" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-lg font-semibold shadow-lg">
Upload PDF
</Link><br></br>
<Link href="/ask" className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl text-lg font-semibold shadow-lg">
Ask Questions
</Link>
</div>
</section>
</div>
);
}