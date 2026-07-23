const { QdrantClient } = require("@qdrant/js-client-rest");

const qdrant = new QdrantClient({
  host: "127.0.0.1",
  port: 6333,
});

module.exports = qdrant;