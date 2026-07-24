import { FiCheckCircle, FiAlertCircle, FiX } from "react-icons/fi";

export default function Toast({ toast, onClose }) {
  if (!toast?.message) return null;

  const isError = toast.type === "error";

  return (
    <div
      className={`fixed bottom-8 right-8 z-50 glass-panel px-6 py-4 rounded-2xl flex items-center gap-4 border shadow-2xl transition-all duration-500 animate-slideUp ${
        isError ? "border-[#ffb4ab]/50 bg-[#93000a]/30" : "border-[#b7c4ff]/40 bg-[#171f33]/90"
      }`}
    >
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
          isError ? "bg-[#93000a]/50 text-[#ffb4ab]" : "bg-[#0052ff]/20 text-[#7bd0ff]"
        }`}
      >
        {isError ? <FiAlertCircle className="text-xl" /> : <FiCheckCircle className="text-xl" />}
      </div>

      <div className="min-w-0 pr-2">
        <p className="text-sm font-bold text-[#dae2fd]">{toast.message}</p>
        {toast.subtext && (
          <p className="text-xs text-[#c3c5d9] mt-0.5">{toast.subtext}</p>
        )}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="p-1 text-[#8d90a2] hover:text-[#dae2fd] rounded-lg transition-colors"
      >
        <FiX className="text-base" />
      </button>
    </div>
  );
}
