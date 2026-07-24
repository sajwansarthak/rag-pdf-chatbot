import { FiSearch, FiBell, FiHelpCircle } from "react-icons/fi";

export default function Header({ title, searchQuery, setSearchQuery, onNotificationClick, onHelpClick }) {
  return (
    <header className="w-full h-16 shrink-0 z-30 flex items-center justify-between px-10 bg-[#0b1326]/90 backdrop-blur-xl border-b border-[#434656]/20">
      <div className="flex items-center gap-4 min-w-0">
        <span className="font-['Hanken_Grotesk'] text-2xl font-bold text-[#b7c4ff] tracking-tight truncate">
          {title}
        </span>
      </div>

      <div className="flex items-center gap-6 shrink-0">
        {/* Search Bar */}
        <div className="relative w-80">
          <FiSearch className="absolute left-4 top-3 -translate-y-1/2 text-[#8d90a2] text-lg pointer-events-none z-10" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search knowledge base..."
            style={{ paddingLeft: "3.25rem" }}
            className="w-full bg-[#222a3d] text-[#dae2fd] placeholder-[#8d90a2] border border-[#434656]/40 rounded-full py-2.5 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#b7c4ff] focus:border-[#b7c4ff] transition-all"
          />
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onNotificationClick}
            className="text-[#c3c5d9] hover:text-[#b7c4ff] transition-colors p-2 rounded-xl hover:bg-[#222a3d] active:opacity-80 relative"
            title="Notifications"
          >
            <FiBell className="text-xl" />
          </button>

          <button
            type="button"
            onClick={onHelpClick}
            className="text-[#c3c5d9] hover:text-[#b7c4ff] transition-colors p-2 rounded-xl hover:bg-[#222a3d] active:opacity-80"
            title="Help & Info"
          >
            <FiHelpCircle className="text-xl" />
          </button>

          <div className="h-6 w-[1px] bg-[#434656]/30 mx-1"></div>

          {/* Profile Avatar */}
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhCleR4gPnxVD77lI2AtTRwLaJy9AqMg8JOooXioKyOCmxodhu2vo5vkDghFrsC4vkn9TQgHLZCCitVE4ehLorLq25kHkSumCja8kektUpbWTxcSMTiK8ASMrzJVlyx4S0R5SGjRHiky_pPDJA1ZJumLUtRZ_wLcsJkOVBrcqFQjlQinVHIv7JNzDFex3Xk4Y6QEN_r4h-aXtzcBBak9kj0dIySsiamC42BtsRyZ-BKN6ZSXC0b81zh5SfASn6NI5ZcE8X7-mYxuI"
            alt="User Avatar"
            className="w-9 h-9 rounded-full border-2 border-[#b7c4ff]/30 object-cover"
          />
        </div>
      </div>
    </header>
  );
}
