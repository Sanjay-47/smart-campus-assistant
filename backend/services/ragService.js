import { ChromaClient } from "chromadb";
import fetch from "node-fetch";



// The ChromaDB client connects to your running Chroma Server on port 8000
const client = new ChromaClient({
    path: "http://localhost:8000",
});

// This function gets embeddings from your running Ollama instance on port 11434
const getEmbeddings = async (texts) => {
    const vectors = [];

    for (let t of texts) {
        const res = await fetch("http://localhost:11434/api/embed", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "mxbai-embed-large",
                input: t
            })
        });

        const data = await res.json();

        if (!data.embeddings || !data.embeddings[0]) {
            console.error("Ollama embed response:", data);
            throw new Error("Embedding not returned by Ollama");
        }
        vectors.push(data.embeddings[0]);
    }

    return vectors;
};

const COLLECTION_NAME = "documents_local";

// ---- STORE CHUNKS ----
export const storeChunks = async (chunks) => {
    // 1. Get/Create Collection (NO embeddingFunction needed since we provide embeddings)
    const collection = await client.getOrCreateCollection({
        name: COLLECTION_NAME,
        // REMOVED: embeddingFunction: null
    });

    // 2. Generate embeddings using Ollama (mxbai-embed-large)
    const embeddings = await getEmbeddings(chunks);
    const timestamp = Date.now();

    // 3. Add chunks and their corresponding embeddings to ChromaDB
    await collection.add({
        ids: chunks.map((_, i) => `chunk-${timestamp}-${i}`),
        documents: chunks,
        embeddings, // <-- Passing the embeddings calculated by Ollama
        metadatas: chunks.map(text => ({ text }))
    });

    console.log("Stored chunks:", chunks.length);
    return chunks.length;
};

async function resetCollection() {
  try {
    await client.deleteCollection({ name: "documents_local" });
    console.log("🗑️ Old chunks deleted");
  } catch (e) {
    // collection might not exist yet – ignore
    console.log("No existing collection to delete");
  }
}


// ---- QUERY CHUNKS ----
export const queryChunks = async (query, nResults = 3) => {
    // 1. Get Collection (NO embeddingFunction needed since we provide embeddings)
    const collection = await client.getOrCreateCollection({
        name: COLLECTION_NAME,
        // REMOVED: embeddingFunction: null
    });

    // 2. Generate the query embedding using the SAME Ollama model
    const [queryEmbedding] = await getEmbeddings([query]);

    // 3. Query the collection using the query embedding
    const result = await collection.query({
        queryEmbeddings: [queryEmbedding], // <-- Passing the query embedding
        nResults
    });

    return result;
};

export {

  resetCollection,
  client
};

