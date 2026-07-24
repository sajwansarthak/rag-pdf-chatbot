import { FiUploadCloud, FiMessageSquare, FiPlus } from "react-icons/fi";

export default function Sidebar({ activeTab, setActiveTab, indexed, messageCount, onNewAnalysis }) {
  return (
    <aside className="w-64 shrink-0 h-full bg-[#171f33] border border-[#434656]/30 rounded-2xl flex flex-col select-none shadow-xl">
      <div className="p-6 flex flex-col h-full">
        {/* Brand Header with generous margin below DEEP WORK MODE */}
        <div className="mb-14">
          <h1 className="font-['Hanken_Grotesk'] text-3xl font-extrabold text-[#b7c4ff] tracking-tight">
            InsightRAG
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-[#7bd0ff] animate-pulse"></span>
            <p className="font-['JetBrains_Mono'] text-[11px] font-normal text-[#7bd0ff] tracking-wider uppercase opacity-85">
              DEEP WORK MODE
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-3">
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 text-left ${
              activeTab === "upload"
                ? "bg-[#2d3449] text-[#b7c4ff] border-r-4 border-[#0052ff] shadow-sm"
                : "text-[#c3c5d9] hover:bg-[#2d3449]/50 hover:text-white"
            }`}
          >
            <FiUploadCloud className="text-xl shrink-0" />
            <span>Upload</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("chat")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 text-left ${
              activeTab === "chat"
                ? "bg-[#2d3449] text-[#b7c4ff] border-r-4 border-[#0052ff] shadow-sm"
                : "text-[#c3c5d9] hover:bg-[#2d3449]/50 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <FiMessageSquare className="text-xl shrink-0" />
              <span>Chat History</span>
            </div>
            {indexed && (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#0052ff]/30 text-[#b7c4ff] border border-[#0052ff]/50">
                {messageCount > 0 ? messageCount : "Ready"}
              </span>
            )}
          </button>
        </nav>

        {/* Bottom Action Button with margin below */}
        <div className="mt-auto pt-6 mb-4">
          <button
            type="button"
            onClick={onNewAnalysis}
            className="w-full py-3.5 px-4 bg-[#0052ff] hover:bg-[#004ced] text-[#dfe3ff] font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(0,82,255,0.35)] active:scale-95 transition-all flex items-center justify-center gap-2 group mb-2"
          >
            <FiPlus className="text-lg transition-transform group-hover:rotate-90" />
            <span>New Analysis</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
