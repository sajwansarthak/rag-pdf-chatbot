export default function Loader({ label = "Thinking..." }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-400">
      <span className="flex gap-1">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#19c37d] [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#19c37d] [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#19c37d]" />
      </span>
      <span>{label}</span>
    </div>
  );
}
