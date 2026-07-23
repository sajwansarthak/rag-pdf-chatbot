import { FaRobot } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="h-16 bg-[#202123] border-b border-gray-700 flex items-center justify-between px-8">

      <div className="flex items-center gap-3">
        <FaRobot size={24} className="text-green-400" />
        <h1 className="text-white text-xl font-semibold">
          PDF Chat-Bot
        </h1>
      </div>

      <div className="text-gray-400">
        RAG Assistant
      </div>

    </nav>
  );
}