const {ChatOllama} = require("@langchain/ollama")

const generationModel = new ChatOllama({
    model: "qwen3:4b",
    baseUrl: "http://127.0.0.1:11434",
    //gives more factual, consistent RAG answers.
    temperature: 0,
    //prevents the model from spending tokens on visible reasoning; usually better for straightforward document Q&A.
    think: false,
})

module.exports = generationModel