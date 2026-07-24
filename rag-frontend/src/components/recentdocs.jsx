import { BsFileEarmarkPdf } from "react-icons/bs";
import { FiMessageSquare, FiTrash2, FiFileText } from "react-icons/fi";

export default function RecentDocs({ documents, onSelectDoc, onDeleteDoc, activeDocName }) {
  const hasDocs = documents && documents.length > 0;

  return (
    <section className="w-full pb-8">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-['Hanken_Grotesk'] text-2xl font-semibold text-[#dae2fd]">
          Recent Documents
        </h4>
        {hasDocs && (
          <span className="text-xs font-['JetBrains_Mono'] text-[#7bd0ff] uppercase tracking-wider">
            {documents.length} File{documents.length > 1 ? "s" : ""} in History
          </span>
        )}
      </div>

      {!hasDocs ? (
        <div className="w-full glass-panel p-8 rounded-2xl text-center flex flex-col items-center justify-center border border-[#434656]/30">
          <div className="w-14 h-14 rounded-2xl bg-[#222a3d] border border-[#434656]/40 flex items-center justify-center mb-4 text-[#8d90a2]">
            <FiFileText className="text-2xl" />
          </div>
          <h5 className="font-bold text-[#dae2fd] text-lg mb-1">No documents uploaded yet</h5>
          <p className="text-[#c3c5d9] text-sm max-w-md">
            Upload a PDF document above to index its text into the Qdrant vector database and start chatting.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {documents.map((doc) => {
            const isActive = activeDocName === doc.name;
            return (
              <div
                key={doc.id || doc.name}
                onClick={() => onSelectDoc(doc)}
                className={`glass-panel p-5 rounded-2xl flex items-center gap-5 hover:border-[#b7c4ff]/50 transition-all cursor-pointer group ${
                  isActive ? "border-[#0052ff] bg-[#222a3d]/80 shadow-[0_0_20px_rgba(0,82,255,0.15)]" : ""
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#93000a]/20 border border-[#ffb4ab]/30 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <BsFileEarmarkPdf className="text-[#ffb4ab] text-2xl" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-[#dae2fd] truncate group-hover:text-[#b7c4ff] transition-colors text-base">
                      {doc.name}
                    </h5>
                    {isActive && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#0052ff]/30 text-[#b7c4ff] border border-[#0052ff]/40 shrink-0">
                        Active
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-[#c3c5d9]">{doc.formattedTime || "Uploaded recently"}</span>
                    <span className="w-1 h-1 rounded-full bg-[#8d90a2]"></span>
                    <span className="text-xs text-[#c3c5d9]">{doc.size}</span>
                    {doc.chunks != null && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-[#8d90a2]"></span>
                        <span className="text-xs text-[#7bd0ff] font-['JetBrains_Mono']">
                          {doc.chunks} chunks
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDoc(doc);
                    }}
                    className="p-2 text-[#c3c5d9] hover:text-[#b7c4ff] hover:bg-[#2d3449] rounded-xl transition-colors"
                    title="Start Chat Analysis"
                  >
                    <FiMessageSquare className="text-lg" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDoc(doc.id || doc.name);
                    }}
                    className="p-2 text-[#8d90a2] hover:text-[#ffb4ab] hover:bg-[#93000a]/20 rounded-xl transition-colors"
                    title="Delete from history"
                  >
                    <FiTrash2 className="text-lg" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
