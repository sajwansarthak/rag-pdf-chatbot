import { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import ChatMessage from "./chatmessage";
import Loader from "./loader";

export default function ChatWindow({
  messages,
  loading,
  onSend,
  disabled,
  placeholder,
}) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function submit() {
    const question = input.trim();
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

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 && !loading ? (
          <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center">
            <h2 className="text-2xl font-semibold text-white">
              Ask anything about your PDF
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-gray-400">
              Your document is indexed. Type a question below and the assistant
              will answer using retrieved context from the vector database.
            </p>
          </div>
        ) : (
          <div>
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                role={msg.role}
                content={msg.content}
                meta={msg.meta}
              />
            ))}
            {loading && (
              <div className="border-b border-[#4e4f60]/30 bg-[#444654]">
                <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
                  <Loader label="Searching document & generating answer..." />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-[#4e4f60] bg-[#343541] px-4 py-4">
        <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-xl border border-[#565869] bg-[#40414f] px-3 py-2 shadow-lg focus-within:border-gray-400">
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
            placeholder={placeholder}
            className="max-h-40 min-h-[44px] flex-1 resize-none bg-transparent py-2.5 text-[15px] text-white outline-none placeholder:text-gray-500 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={submit}
            disabled={disabled || loading || !input.trim()}
            className="mb-1 flex h-9 w-9 items-center justify-center rounded-lg bg-[#19c37d] text-white transition hover:bg-[#15a86b] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Send message"
          >
            <FiSend size={16} />
          </button>
        </div>
        <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-gray-500">
          Answers are generated only from your uploaded PDF context.
        </p>
      </div>
    </div>
  );
}
