import { useState } from "react";
import Navbar from "../components/navbar";
import UploadBox from "../components/uploadbox";
import ChatWindow from "../components/chatwindow";
import { createDocument, uploadPdf, askQuestion } from "../services/api";

let messageId = 0;
function nextId() {
  messageId += 1;
  return messageId;
}

export default function Home() {
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [indexed, setIndexed] = useState(false);
  const [chunkCount, setChunkCount] = useState(null);
  const [messages, setMessages] = useState([]);
  const [asking, setAsking] = useState(false);

  function handleFileSelect(nextFile, error) {
    setFile(nextFile);
    setUploadError(error);
    setIndexed(false);
    setChunkCount(null);
    setMessages([]);
  }

  function handleClear() {
    setFile(null);
    setUploadError(null);
    setIndexed(false);
    setChunkCount(null);
    setMessages([]);
  }

  async function handleUpload() {
    if (!file || uploading) return;

    setUploading(true);
    setUploadError(null);

    try {
      // Create a fresh pdf-docs collection in the vector DB
      await createDocument();

      // Index the PDF chunks into Qdrant
      const result = await uploadPdf(file);

      setIndexed(true);
      setChunkCount(result.total_chunks ?? null);
      setMessages([
        {
          id: nextId(),
          role: "assistant",
          content: `Your PDF "${file.name}" is ready. I indexed ${
            result.total_chunks ?? "its"
          } text chunks into the vector database. Ask me anything about the document.`,
        },
      ]);
    } catch (err) {
      setIndexed(false);
      setUploadError(err.message || "Failed to upload PDF");
    } finally {
      setUploading(false);
    }
  }

  async function handleSend(question) {
    if (!indexed || asking) return;

    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "user", content: question },
    ]);
    setAsking(true);

    try {
      const result = await askQuestion(question);
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "assistant",
          content: result.answer || "i don't know.",
          meta: {
            similarity_score: result.similarity_score,
            matched_chunk: result.matched_chunk,
          },
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "assistant",
          content: `Sorry, I couldn't answer that. ${err.message}`,
        },
      ]);
    } finally {
      setAsking(false);
    }
  }

  return (
    <div className="flex h-screen flex-col bg-[#343541]">
      <Navbar fileName={indexed ? file?.name : null} />

      {!indexed ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 pb-16">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-white">
              Chat with your PDF
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-gray-400">
              Upload a document to create a new vector collection, then ask
              questions grounded in its content.
            </p>
          </div>

          <UploadBox
            file={file}
            onFileSelect={handleFileSelect}
            onClear={handleClear}
            onUpload={handleUpload}
            uploading={uploading}
            indexed={indexed}
            error={uploadError}
          />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-[#4e4f60]/50 bg-[#202123]/60 px-4 py-2 text-xs text-gray-400 sm:px-6">
            <span>
              Indexed{chunkCount != null ? ` · ${chunkCount} chunks` : ""}
            </span>
            <button
              type="button"
              onClick={handleClear}
              className="text-[#19c37d] hover:underline"
            >
              Upload a different PDF
            </button>
          </div>

          <ChatWindow
            messages={messages}
            loading={asking}
            onSend={handleSend}
            disabled={!indexed}
            placeholder="Ask a question about your PDF..."
          />
        </div>
      )}
    </div>
  );
}
