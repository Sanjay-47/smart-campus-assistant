import "../styles/global.css";

export const metadata = {
  title: "Smart Campus RAG",
  description: "AI-powered Smart Campus Assistant"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <main className="max-w-5xl mx-auto px-4 py-8">
          
          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Smart Campus
              </h1>
              <p className="text-sm text-gray-500">
                AI-powered learning assistant
              </p>
            </div>

            {/* Navigation */}
            <nav className="flex gap-3">
              <a
                href="/upload"
                className="px-4 py-2 rounded-lg bg-white border border-gray-200
                           text-sm font-medium hover:bg-gray-100 transition"
              >
                Upload
              </a>
              <a
                href="/ask"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white
                           text-sm font-medium hover:bg-blue-700 transition"
              >
                Ask
              </a>
            </nav>
          </header>

          {/* Page content */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            {children}
          </section>

          {/* Footer */}
          <footer className="mt-8 text-center text-xs text-gray-400">
            Built with RAG • Ollama • Gemini
          </footer>

        </main>
      </body>
    </html>
  );
}
