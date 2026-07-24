import { useState } from "react";
import { FiUser, FiCpu, FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function ChatMessage({ role, content, meta }) {
  const isUser = role === "user";
  const [showChunk, setShowChunk] = useState(false);

  return (
    <div
      className={`w-full py-6 border-b border-[#434656]/20 transition-colors ${
        isUser ? "bg-[#0b1326]/50" : "bg-[#171f33]/60"
      }`}
    >
      <div className="max-w-4xl mx-auto px-6 flex gap-4">
        {/* Avatar icon */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
            isUser
              ? "bg-[#0052ff]/20 border-[#0052ff]/50 text-[#b7c4ff]"
              : "bg-[#2d3449] border-[#b7c4ff]/30 text-[#7bd0ff] shadow-[0_0_15px_rgba(123,208,255,0.15)]"
          }`}
        >
          {isUser ? <FiUser className="text-xl" /> : <FiCpu className="text-xl" />}
        </div>

        {/* Content & Metadata */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-['JetBrains_Mono'] text-xs font-semibold uppercase tracking-wider text-[#8d90a2]">
              {isUser ? "You" : "InsightRAG AI"}
            </span>

            {!isUser && meta?.similarity_score != null && (
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#0052ff]/20 border border-[#b7c4ff]/30 font-['JetBrains_Mono'] text-[11px] text-[#7bd0ff]">
                  Similarity: {(meta.similarity_score * 100).toFixed(1)}%
                </span>
                {meta.matched_chunk && (
                  <button
                    type="button"
                    onClick={() => setShowChunk(!showChunk)}
                    className="text-xs text-[#b7c4ff] hover:underline flex items-center gap-1"
                  >
                    <span>Context</span>
                    {showChunk ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                )}
              </div>
            )}
          </div>

          <p className="whitespace-pre-wrap text-[15px] leading-7 text-[#dae2fd]">
            {content}
          </p>

          {/* Matched Chunk Drawer */}
          {showChunk && meta?.matched_chunk && (
            <div className="mt-3 p-4 rounded-xl bg-[#060e20] border border-[#434656]/50 text-xs text-[#c3c5d9] font-['JetBrains_Mono'] leading-relaxed animate-fadeIn">
              <div className="text-[10px] text-[#7bd0ff] uppercase tracking-wider mb-1 font-bold">
                Retrieved Chunk Context:
              </div>
              <p className="italic">{meta.matched_chunk}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
