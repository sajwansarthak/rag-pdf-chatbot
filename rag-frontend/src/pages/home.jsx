import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/header";
import UploadBox from "../components/uploadbox";
import RecentDocs from "../components/recentdocs";
import ChatWindow from "../components/chatwindow";
import Footer from "../components/footer";
import Toast from "../components/toast";
import { createDocument, uploadPdf, askQuestion } from "../services/api";

let messageId = 0;
function nextId() {
  messageId += 1;
  return messageId;
}

const STORAGE_KEY = "insightrag_recent_documents";

export default function Home() {
  const [activeTab, setActiveTab] = useState("upload");
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [indexed, setIndexed] = useState(false);
  const [chunkCount, setChunkCount] = useState(null);
  const [messages, setMessages] = useState([]);
  const [asking, setAsking] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentDocs, setRecentDocs] = useState([]);
  const [toast, setToast] = useState(null);

  function triggerToast(message, subtext = "", type = "info") {
    setToast({ message, subtext, type });
  }

  // Load stored user documents from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentDocs(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load stored documents:", err);
    }
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  function saveDocsToStorage(docs) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
    } catch (err) {
      console.error("Failed to save documents to localStorage:", err);
    }
  }

  function handleFileSelect(nextFile, error) {
    setFile(nextFile);
    setUploadError(error);
    setIndexed(false);
    setChunkCount(null);
    if (error) {
      triggerToast(error, "File selection error", "error");
    }
  }

  function handleClear() {
    setFile(null);
    setUploadError(null);
    setIndexed(false);
    setChunkCount(null);
  }

  async function handleNewAnalysis() {
    setFile(null);
    setUploadError(null);
    setIndexed(false);
    setChunkCount(null);
    setMessages([]);
    setActiveTab("upload");

    try {
      await createDocument();
      triggerToast("New Analysis Session", "Vector database collection reset", "info");
    } catch (err) {
      console.warn("Reset collection warning:", err);
      triggerToast("New Session Ready", "Select or upload a PDF document", "info");
    }
  }

  async function handleUpload() {
    if (!file || uploading) return;

    setUploading(true);
    setUploadError(null);
    triggerToast("Document analyzing...", "Extracting & embedding text chunks", "info");

    try {
      await createDocument();
      const result = await uploadPdf(file);

      const totalChunks = result.total_chunks ?? 0;
      setIndexed(true);
      setChunkCount(totalChunks);

      const formattedSize =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${(file.size / 1024).toFixed(0)} KB`;

      const newDocRecord = {
        id: `doc-${Date.now()}`,
        name: file.name,
        formattedTime: "Uploaded just now",
        size: formattedSize,
        chunks: totalChunks,
        timestamp: Date.now(),
      };

      setRecentDocs((prev) => {
        const updated = [newDocRecord, ...prev.filter((d) => d.name !== file.name)];
        saveDocsToStorage(updated);
        return updated;
      });

      setMessages([
        {
          id: nextId(),
          role: "assistant",
          content: `Document "${file.name}" has been successfully indexed! ${totalChunks} text chunks were vector-embedded into Qdrant. Ask me anything about the document.`,
        },
      ]);

      triggerToast("Document Indexed Successfully!", `${totalChunks} chunks stored in vector DB`, "success");

      setTimeout(() => {
        setActiveTab("chat");
      }, 1000);
    } catch (err) {
      setIndexed(false);
      const msg = err.message || "Failed to upload PDF";
      setUploadError(msg);
      triggerToast("Upload Error", msg, "error");
    } finally {
      setUploading(false);
    }
  }

  async function handleSend(question) {
    if (!indexed || asking) {
      if (!indexed) {
        triggerToast("Please upload a PDF first", "Document index required for RAG", "error");
      }
      return;
    }

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
      triggerToast("Query Failed", err.message, "error");
    } finally {
      setAsking(false);
    }
  }

  function handleSelectDoc(doc) {
    if (file?.name === doc.name && indexed) {
      setActiveTab("chat");
      return;
    }

    triggerToast(`Selected ${doc.name}`, "Upload or re-index document to start querying", "info");
    setActiveTab("upload");
  }

  function handleDeleteDoc(docId) {
    setRecentDocs((prev) => {
      const updated = prev.filter((d) => (d.id || d.name) !== docId);
      saveDocsToStorage(updated);
      return updated;
    });
    triggerToast("Document removed", "File deleted from recent history", "info");
  }

  const filteredRecentDocs = recentDocs.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-full relative bg-[#0b1326] font-['Inter'] antialiased overflow-hidden p-16 gap-8">
      {/* Floating Side Navigation Bar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        indexed={indexed}
        messageCount={messages.length}
        onNewAnalysis={handleNewAnalysis}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen relative min-w-0 overflow-hidden rounded-2xl bg-[#0b1326] border border-[#434656]/20 shadow-2xl">
        {/* Top App Bar */}
        <Header
          title={
            activeTab === "upload"
              ? "Documents"
              : indexed
              ? file?.name
              : "Chat Analysis"
          }
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onNotificationClick={() =>
            triggerToast(
              "System Operational",
              "Qdrant Vector DB & Deep Learning Model Online",
              "info"
            )
          }
          onHelpClick={() =>
            triggerToast(
              "InsightRAG Help",
              "Upload a PDF document to begin RAG vector search & chat.",
              "info"
            )
          }
        />

        {/* Scrollable Canvas Area with centered container for equal left & right margins */}
        {activeTab === "upload" ? (
          <div className="flex-1 overflow-y-auto px-8 md:px-12 py-10 space-y-10 flex flex-col justify-between">
            <div className="w-full max-w-5xl mx-auto space-y-10">
              {/* Hero Heading */}
              <div className="w-full">
                <h2 className="font-['Hanken_Grotesk'] text-4xl md:text-5xl font-extrabold text-[#dae2fd] mb-3 leading-tight tracking-tight">
                  Synthesize Your Knowledge
                </h2>
                <p className="text-[#c3c5d9] text-lg max-w-2xl leading-relaxed">
                  Upload complex documents for deep RAG-based analysis. Our engine extracts insights across high-density technical and financial data.
                </p>
              </div>

              {/* Central Upload Zone with centered equal margins */}
              <UploadBox
                file={file}
                onFileSelect={handleFileSelect}
                onClear={handleClear}
                onUpload={handleUpload}
                uploading={uploading}
                indexed={indexed}
                error={uploadError}
              />

              {/* Recent Documents Section */}
              <RecentDocs
                documents={filteredRecentDocs}
                onSelectDoc={handleSelectDoc}
                onDeleteDoc={handleDeleteDoc}
                activeDocName={file?.name}
              />
            </div>

            {/* Footer component */}
            <Footer />
          </div>
        ) : (
          /* Chat Analysis View */
          <ChatWindow
            fileName={file?.name}
            chunkCount={chunkCount}
            messages={messages}
            loading={asking}
            onSend={handleSend}
            disabled={!indexed}
            onSwitchToUpload={() => setActiveTab("upload")}
          />
        )}
      </main>

      {/* Floating Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
