import { useRef, useState } from "react";
import { FiUploadCloud, FiFileText, FiX } from "react-icons/fi";

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
    if (next.type !== "application/pdf") {
      onFileSelect(null, "Please select a PDF file");
      return;
    }
    onFileSelect(next, null);
  }

  return (
    <div className="mx-auto w-full max-w-xl space-y-4 px-4">
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
        className={`cursor-pointer rounded-xl border-2 border-dashed px-6 py-12 text-center transition ${
          dragOver
            ? "border-[#19c37d] bg-[#19c37d]/10"
            : "border-[#565869] bg-[#40414f]/40 hover:border-gray-400"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <FiUploadCloud
          size={40}
          className="mx-auto mb-3 text-[#19c37d]"
        />
        <p className="text-base font-medium text-white">
          Drop your PDF here, or click to browse
        </p>
        <p className="mt-2 text-sm text-gray-400">
          The document will be indexed into the vector database
        </p>
      </div>

      {file && (
        <div className="flex items-center justify-between gap-3 rounded-lg bg-[#40414f] px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <FiFileText className="shrink-0 text-[#19c37d]" size={20} />
            <div className="min-w-0">
              <p className="truncate text-sm text-white">{file.name}</p>
              <p className="text-xs text-gray-400">
                {(file.size / 1024).toFixed(1)} KB
                {indexed ? " · Indexed" : ""}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="rounded p-1.5 text-gray-400 hover:bg-[#565869] hover:text-white"
            aria-label="Remove file"
          >
            <FiX size={18} />
          </button>
        </div>
      )}

      {error && (
        <p className="text-center text-sm text-red-400">{error}</p>
      )}

      <button
        type="button"
        disabled={!file || uploading}
        onClick={onUpload}
        className="w-full rounded-lg bg-[#19c37d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#15a86b] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {uploading ? "Indexing PDF..." : "Upload & Index PDF"}
      </button>
    </div>
  );
}
