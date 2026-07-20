const {OllamaEmbeddings} = require ("@langchain/ollama")

const embeddings = new OllamaEmbeddings({
    model:"embeddinggemma",
    //baseurl tells langchain where your local ollama server is running 
    baseUrl: "http://127.0.0.1:11434"
})

module.exports = embeddings