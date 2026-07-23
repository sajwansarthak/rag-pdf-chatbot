import { FaRobot } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";

export default function Navbar({ fileName }) {
  return (
    <nav className="h-14 shrink-0 border-b border-[#4e4f60] bg-[#202123]">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <FaRobot size={22} className="text-[#19c37d]" />
          <h1 className="text-lg font-semibold tracking-tight text-white">
            PDF Chat-Bot
          </h1>
        </div>

        {fileName ? (
          <div className="flex max-w-[50%] items-center gap-2 text-sm text-gray-300">
            <FiFileText className="shrink-0 text-[#19c37d]" size={16} />
            <span className="truncate">{fileName}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-500">RAG Assistant</span>
        )}
      </div>
    </nav>
  );
}
