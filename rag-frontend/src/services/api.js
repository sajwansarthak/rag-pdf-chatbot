const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function parseResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || data.error || "Request failed");
  }
  return data;
}

/** Create a fresh pdf-docs collection in Qdrant */
export async function createDocument() {
  const res = await fetch(`${API_BASE}/create-document`);
  return parseResponse(res);
}

/** Upload PDF and index chunks into the vector DB */
export async function uploadPdf(file) {
  const formData = new FormData();
  formData.append("pdf", file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });

  return parseResponse(res);
}

/** Ask a question against the indexed PDF */
export async function askQuestion(question) {
  const res = await fetch(`${API_BASE}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  return parseResponse(res);
}
