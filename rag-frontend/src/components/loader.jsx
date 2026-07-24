export default function Loader({ label = "Analyzing context..." }) {
  return (
    <div className="flex items-center gap-3 text-sm text-[#b7c4ff] font-medium">
      <span className="flex gap-1.5 items-center">
        <span className="h-2 w-2 animate-bounce rounded-full bg-[#0052ff] [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-[#7bd0ff] [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-[#b7c4ff]" />
      </span>
      <span className="font-['JetBrains_Mono'] text-xs text-[#c3c5d9]">{label}</span>
    </div>
  );
}
