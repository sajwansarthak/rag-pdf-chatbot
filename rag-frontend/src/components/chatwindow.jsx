import { useEffect, useRef, useState } from "react";
import { FiSend, FiUploadCloud, FiArrowRight, FiBarChart2 } from "react-icons/fi";
import ChatMessage from "./chatmessage";
import Loader from "./loader";

export default function ChatWindow({
  fileName,
  chunkCount,
  messages,
  loading,
  onSend,
  disabled,
  onSwitchToUpload,
}) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  const samplePrompts = [
    "Summarize the main points of this document.",
    "What are the key technical specifications or data mentioned?",
    "Identify any risks or important conclusions outlined.",
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function submit(textToSend) {
    const question = (textToSend || input).trim();
    if (!question || loading || disabled) return;
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    onSend(question);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  const isInitialState = messages.length === 0 && !loading;

  return (
    <div className="flex flex-col h-full min-h-0 flex-1 relative bg-[#0b1326] rounded-2xl overflow-hidden">
      {/* Top Document Context Sub-header */}
      <div className="shrink-0 flex items-center justify-between px-8 py-3 bg-[#171f33]/70 backdrop-blur-md border-b border-[#434656]/30 text-xs z-10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-2.5 h-2.5 rounded-full bg-[#0052ff] animate-pulse shrink-0"></div>
          <span className="font-bold text-[#dae2fd] truncate max-w-sm">
            {fileName || "No document loaded"}
          </span>
          {chunkCount != null && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#222a3d] text-[#7bd0ff] font-['JetBrains_Mono'] border border-[#434656]/40 shrink-0">
              {chunkCount} chunks indexed
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onSwitchToUpload}
          className="text-[#b7c4ff] hover:text-white font-semibold flex items-center gap-1.5 transition-colors shrink-0"
        >
          <FiUploadCloud className="text-base" />
          <span>Upload Another PDF</span>
        </button>
      </div>

      {/* Main View Area */}
      {isInitialState ? (
        /* CENTERED LANDING STATE: Deep RAG Synthesis Ready & Chat Box in Center */
        <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
          <div className="w-full max-w-2xl flex flex-col items-center text-center space-y-6">
            {/* Center Icon */}
            <div className="w-16 h-16 rounded-2xl bg-[#0052ff]/20 border border-[#b7c4ff]/30 flex items-center justify-center shadow-[0_0_25px_rgba(0,82,255,0.25)]">
              <FiBarChart2 className="text-[#b7c4ff] text-3xl" />
            </div>

            {/* Center Heading */}
            <div>
              <h3 className="font-['Hanken_Grotesk'] text-3xl md:text-4xl font-bold text-[#dae2fd] mb-2 tracking-tight">
                Deep RAG Synthesis Ready
              </h3>
              <p className="text-[#c3c5d9] text-sm md:text-base max-w-lg leading-relaxed">
                Ask any detailed question about{" "}
                <span className="text-[#b7c4ff] font-semibold">{fileName || "your document"}</span>. Answers will be retrieved directly from Qdrant vector store.
              </p>
            </div>

            {/* CENTERED CHAT BOX */}
            <div className="w-full relative glass-panel rounded-2xl p-2.5 border border-[#434656]/50 focus-within:border-[#b7c4ff] transition-all flex items-end gap-3 shadow-2xl">
              <textarea
                ref={textareaRef}
                rows={2}
                value={input}
                disabled={disabled || loading}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
                }}
                onKeyDown={handleKeyDown}
                placeholder={
                  disabled
                    ? "Please upload a document first to start chatting..."
                    : "Ask a detailed question about your document..."
                }
                className="flex-1 bg-transparent py-2 px-3 text-sm text-[#dae2fd] placeholder-[#8d90a2] focus:outline-none resize-none max-h-40 min-h-[48px]"
              />

              <button
                type="button"
                onClick={() => submit()}
                disabled={disabled || loading || !input.trim()}
                className="mb-1 p-3 rounded-xl bg-[#0052ff] hover:bg-[#004ced] text-[#dfe3ff] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(0,82,255,0.3)] active:scale-95 shrink-0"
                title="Send Message"
              >
                <FiSend className="text-lg" />
              </button>
            </div>

            {/* SUGGESTED PROMPTS BELOW CHAT BOX */}
            <div className="w-full space-y-2 pt-2">
              <p className="text-[11px] font-['JetBrains_Mono'] text-[#8d90a2] uppercase tracking-wider">
                SUGGESTED PROMPTS
              </p>
              <div className="space-y-2">
                {samplePrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => submit(prompt)}
                    className="w-full text-left p-3.5 rounded-xl glass-panel border border-[#434656]/30 hover:border-[#b7c4ff]/40 text-xs font-medium text-[#dae2fd] hover:text-[#b7c4ff] transition-all flex items-center justify-between group"
                  >
                    <span>{prompt}</span>
                    <FiArrowRight className="text-[#8d90a2] group-hover:text-[#b7c4ff] transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[11px] font-['JetBrains_Mono'] text-[#8d90a2] pt-2">
              InsightRAG guarantees answers derived strictly from document vectors.
            </p>
          </div>
        </div>
      ) : (
        /* CONVERSATION ACTIVE STATE */
        <div className="flex flex-col flex-1 min-h-0">
          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto min-h-0 divide-y divide-[#434656]/20">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                role={msg.role}
                content={msg.content}
                meta={msg.meta}
              />
            ))}
            {loading && (
              <div className="py-8 bg-[#171f33]/60">
                <div className="max-w-4xl mx-auto px-6">
                  <Loader label="Embedding query & querying vector store..." />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Bottom Chat Input Bar */}
          <div className="shrink-0 p-6 bg-[#0b1326] border-t border-[#434656]/20">
            <div className="max-w-4xl mx-auto">
              <div className="relative glass-panel rounded-2xl p-2 border border-[#434656]/40 focus-within:border-[#b7c4ff] transition-all flex items-end gap-3 shadow-xl">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={input}
                  disabled={disabled || loading}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    disabled
                      ? "Please upload a document first to start chatting..."
                      : "Ask a detailed question about your document..."
                  }
                  className="flex-1 bg-transparent py-2.5 px-3 text-sm text-[#dae2fd] placeholder-[#8d90a2] focus:outline-none resize-none max-h-40 min-h-[44px]"
                />

                <button
                  type="button"
                  onClick={() => submit()}
                  disabled={disabled || loading || !input.trim()}
                  className="mb-1 p-3 rounded-xl bg-[#0052ff] hover:bg-[#004ced] text-[#dfe3ff] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(0,82,255,0.3)] active:scale-95 shrink-0"
                  title="Send Message"
                >
                  <FiSend className="text-lg" />
                </button>
              </div>

              <p className="mt-2 text-center text-[11px] font-['JetBrains_Mono'] text-[#8d90a2]">
                InsightRAG guarantees answers derived strictly from document vectors.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
