# RAG application

The PDF upload endpoint extracts paragraph chunks and creates local embeddings
with LangChain's `OllamaEmbeddings` integration.

## Setup

1. Start Ollama and download the default embedding model:

   ```bash
   ollama pull nomic-embed-text
   ollama serve
   ```

2. In `backend`, copy `.env.example` to `.env` if you want to change the
   Ollama URL or embedding model, then start the API:

   ```bash
   npm start
   ```

3. Upload a PDF using the `pdf` multipart form field to `POST /upload`.
   The response includes each text chunk and its embedding vector. Store those
   vectors in a vector database in the next RAG step.
