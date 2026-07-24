export default function Footer() {
  return (
    <footer className="max-w-5xl mx-auto w-full pt-8 pb-6 mt-12 border-t border-[#434656]/20 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8d90a2] font-['JetBrains_Mono']">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#7bd0ff] animate-pulse"></span>
        <span>InsightRAG Engine v1.0</span>
      </div>
      <p className="mt-2 sm:mt-0">
        Powered by Qdrant Vector Database & Deep RAG Embeddings
      </p>
    </footer>
  );
}
