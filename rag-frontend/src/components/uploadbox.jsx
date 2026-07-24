import { useRef, useState } from "react";
import { FiUploadCloud, FiX, FiCheckCircle, FiZap, FiAlertCircle, FiLoader } from "react-icons/fi";
import { BsFileEarmarkPdf } from "react-icons/bs";

export default function UploadBox({
  file,
  onFileSelect,
  onClear,
  onUpload,
  uploading,
  indexed,
  error,
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  function handleFiles(files) {
    const next = files?.[0];
    if (!next) return;
    if (next.type !== "application/pdf" && !next.name.toLowerCase().endsWith(".pdf")) {
      onFileSelect(null, "Please select a valid PDF file");
      return;
    }
    onFileSelect(next, null);
  }

  return (
    <section className="w-full space-y-6">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`w-full p-10 glass-panel group cursor-pointer transition-all relative overflow-hidden h-[360px] flex flex-col items-center justify-center text-center ${
          dragOver ? "upload-dashed-active bg-[#2d3449]/70" : "upload-dashed hover:bg-[#2d3449]/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[#0052ff]/20 flex items-center justify-center mb-6 border border-[#b7c4ff]/30 group-hover:scale-110 transition-transform shadow-[0_0_25px_rgba(0,82,255,0.2)]">
            <FiUploadCloud className="text-[#b7c4ff] text-4xl" />
          </div>

          <h3 className="font-['Hanken_Grotesk'] text-3xl font-semibold text-[#dae2fd] mb-2">
            Drag and drop documents here
          </h3>
          <p className="text-[#c3c5d9] mb-8 text-base">
            or click to browse local files for upload
          </p>

          <div className="flex gap-4 items-center">
            <span className="px-4 py-1.5 bg-[#222a3d] border border-[#434656]/40 rounded-full font-['JetBrains_Mono'] text-xs font-medium text-[#7bd0ff]">
              Max 50MB
            </span>
            <span className="px-4 py-1.5 bg-[#0052ff]/20 border border-[#b7c4ff]/30 rounded-full font-['JetBrains_Mono'] text-xs font-medium text-[#b7c4ff]">
              PDF ONLY
            </span>
          </div>
        </div>
      </div>

      {/* Selected File Card */}
      {file && (
        <div className="w-full glass-panel p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#b7c4ff]/30 shadow-lg">
          <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-xl bg-[#93000a]/20 border border-[#ffb4ab]/30 flex items-center justify-center shrink-0">
              <BsFileEarmarkPdf className="text-[#ffb4ab] text-2xl" />
            </div>
            <div className="min-w-0 flex-1">
              <h5 className="font-bold text-[#dae2fd] truncate text-base">{file.name}</h5>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-[#c3c5d9]">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#8d90a2]"></span>
                <span className={`text-xs font-medium ${indexed ? "text-[#7bd0ff]" : "text-[#b7c4ff]"}`}>
                  {indexed ? "Indexed into Qdrant Vector DB" : "Selected & Ready"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end shrink-0">
            <button
              type="button"
              onClick={onClear}
              disabled={uploading}
              className="p-2 text-[#c3c5d9] hover:text-white hover:bg-[#2d3449] rounded-xl transition-colors disabled:opacity-50"
              title="Remove file"
            >
              <FiX className="text-xl" />
            </button>

            <button
              type="button"
              disabled={uploading || indexed}
              onClick={onUpload}
              className="px-6 py-2.5 bg-[#0052ff] hover:bg-[#004ced] text-[#dfe3ff] font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(0,82,255,0.3)] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <FiLoader className="text-lg animate-spin" />
                  <span>Indexing Document...</span>
                </>
              ) : indexed ? (
                <>
                  <FiCheckCircle className="text-lg" />
                  <span>Indexed</span>
                </>
              ) : (
                <>
                  <FiZap className="text-lg" />
                  <span>Upload & Index PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="w-full glass-panel p-4 rounded-xl border border-[#ffb4ab]/40 bg-[#93000a]/20 text-[#ffb4ab] text-sm font-medium flex items-center gap-3">
          <FiAlertCircle className="text-xl shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </section>
  );
}
