const {OllamaEmbeddings} = require ("@langchain/ollama")

const embeddings = new OllamaEmbeddings({
    model:"embeddinggemma",
    baseUrl: "http://localhost:11434"
})

module.exports = embeddings