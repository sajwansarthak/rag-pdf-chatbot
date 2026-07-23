import { FaRobot, FaUser } from "react-icons/fa";

export default function ChatMessage({ role, content, meta }) {
  const isUser = role === "user";

  return (
    <div
      className={`w-full border-b border-[#4e4f60]/30 ${
        isUser ? "bg-[#343541]" : "bg-[#444654]"
      }`}
    >
      <div className="mx-auto flex max-w-3xl gap-4 px-4 py-6 sm:px-6">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-sm ${
            isUser ? "bg-[#5436da]" : "bg-[#19c37d]"
          }`}
        >
          {isUser ? (
            <FaUser size={14} className="text-white" />
          ) : (
            <FaRobot size={14} className="text-white" />
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {isUser ? "You" : "Assistant"}
          </p>
          <p className="whitespace-pre-wrap text-[15px] leading-7 text-gray-100">
            {content}
          </p>

          {meta?.similarity_score != null && (
            <p className="pt-1 text-xs text-gray-500">
              Similarity: {(meta.similarity_score * 100).toFixed(1)}%
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
