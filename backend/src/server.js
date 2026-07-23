const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const cors = require("cors");
const fs = require("fs");

const embeddings = require("./services/embeddings");
const generationModel = require("./services/generationModel");
const qdrant = require("./services/qdrant");

const app = express();
const PORT = 3000;
const COLLECTION_NAME = "pdf-docs";

const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "RAG Backend Running 🚀",
  });
});

async function createEmbeddings(chunks) {
  if (!Array.isArray(chunks) || chunks.length === 0) {
    throw new Error("Chunks must be a non-empty array");
  }
  return await embeddings.embedDocuments(chunks);
}

async function answerFromContext(question) {
  const questionEmbedding = await embeddings.embedQuery(question);

  const searchResult = await qdrant.search(COLLECTION_NAME, {
    vector: questionEmbedding,
    limit: 1,
  });

  if (!searchResult.length) {
    return {
      question,
      answer: "i don't know.",
      matched_chunk: null,
      similarity_score: null,
    };
  }

  const bestChunk = searchResult[0].payload.text;
  const bestScore = searchResult[0].score;

  const response = await generationModel.invoke(`
        Answer only using the context below.
        If the answer is not in the context. Say: "i don't know." 

        Context:
        ${bestChunk}

        Question:
        ${question}
        Return only the final answer do not give the reasoning
        `);

  const rawAnswer = response.content;
  const answer = rawAnswer.includes("</think>")
    ? rawAnswer.split("</think>").pop().trim()
    : rawAnswer.trim();

  return {
    question,
    answer,
    matched_chunk: bestChunk,
    similarity_score: bestScore,
  };
}

// Creates a fresh pdf-docs collection in Qdrant
app.get("/create-document", async (req, res) => {
  try {
    const collections = await qdrant.getCollections();
    const exists = collections.collections?.some(
      (c) => c.name === COLLECTION_NAME
    );

    if (exists) {
      await qdrant.deleteCollection(COLLECTION_NAME);
    }

    await qdrant.createCollection(COLLECTION_NAME, {
      vectors: {
        size: 768,
        distance: "Cosine",
      },
    });

    res.json({
      success: true,
      message: "collection created",
      collection: COLLECTION_NAME,
    });
  } catch (err) {
    console.error("Create collection error:", err);
    res.status(500).json({
      success: false,
      message: "Could not create collection",
      error: err.message,
    });
  }
});

// Upload PDF → chunk → embed → store in vector DB
app.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required" });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text;

    // Clean up temp upload
    fs.unlink(req.file.path, () => {});

    const chunks = text
      .split("\n\n")
      .map((chunk) => chunk.trim())
      .filter((chunk) => chunk.length > 0);

    if (chunks.length === 0) {
      return res.status(400).json({
        message: "No readable text was found on the pdf",
      });
    }

    const chunkVectors = await createEmbeddings(chunks);

    const points = chunks.map((chunk, index) => ({
      id: index + 1,
      vector: chunkVectors[index],
      payload: {
        text: chunk,
      },
    }));

    await qdrant.upsert(COLLECTION_NAME, { points });

    // Optional: answer a question in the same request (legacy support)
    if (req.body.question) {
      const result = await answerFromContext(req.body.question);
      return res.json({
        success: true,
        message: "PDF indexed successfully",
        total_chunks: chunks.length,
        ...result,
      });
    }

    return res.json({
      success: true,
      message: "PDF indexed successfully",
      total_chunks: chunks.length,
      filename: req.file.originalname,
    });
  } catch (error) {
    console.error("Upload error:", error);

    if (req.file?.path) {
      fs.unlink(req.file.path, () => {});
    }

    return res.status(500).json({
      message: "Could not process PDF embeddings",
      error: error.message,
    });
  }
});

// Ask a question against the indexed PDF
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !String(question).trim()) {
      return res.status(400).json({ message: "Question is required" });
    }

    const result = await answerFromContext(String(question).trim());
    return res.json(result);
  } catch (error) {
    console.error("Ask error:", error);
    return res.status(500).json({
      message: "Could not answer question",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
