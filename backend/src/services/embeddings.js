let embeddings;

/**
 * Lazily creates the local Ollama embeddings client so the server can start
 * even when Ollama is temporarily unavailable.
 */
async function getEmbeddings() {
  if (!embeddings) {
    const { OllamaEmbeddings } = await import("@langchain/ollama");

    embeddings = new OllamaEmbeddings({
      model: process.env.OLLAMA_EMBEDDING_MODEL || "nomic-embed-text",
      baseUrl: process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434",
    });
  }

  return embeddings;
}

module.exports = { getEmbeddings };
