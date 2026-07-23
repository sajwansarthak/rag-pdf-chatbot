const express = require("express");
//Used to upload pdf file 
const multer = require("multer")
//Used to read uploaded file
const pdfParse = require("pdf-parse")
//importing embeddings model from servies 
const embeddings = require("./services/embeddings")
//adding generation model 
const generationModel = require("./services/generationModel")
//adding qdrantdb
const qdrant = require("./services/qdrant");


const fs = require('fs');
const app = express();
const PORT = 3000;


//multer object 
const upload = multer({dest: "uploads/"})

// Middleware
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "RAG Backend Running 🚀"
    });
});

//Function to create Embeddings
async function createEmbeddings(chunks){
    if(!Array.isArray(chunks) || chunks.length === 0){
        throw new Error("Chunks must be a non-empty array")
    }
    return await embeddings.embedDocuments(chunks)

}

//Adding doc to database
app.get("/create-document", async(req,res) =>{
    try{
        await qdrant.createCollection('pdf-docs',{
            vectors: {
                size: 768,
                distance: "Cosine"
            },
        })
        res.send('collection created')
    }catch(err){
        res.status(500).send(err)
    }
})


//whole working
app.post("/upload", upload.single("pdf"), async (req, res) => {
    console.log(req.body)
    try{
        //getting the data from the file converting it(from bytes) and storing it in text 
        const dataBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdfParse(dataBuffer);
        const text = pdfData.text;
  
        const chunks = text
         //replacing /n/n with /n for testing 
            .split("\n\n")
            .map((chunk) => chunk.trim())
            .filter((chunk) => chunk.length > 0);
  
        if (chunks.length === 0) {
            return res.status(400).json({
                message: "No readable text was found on the pdf"
            })    
        }
        // Creates one vector for every text chunk
        const chunkVectors = await createEmbeddings(chunks);

        // Combines each text chunk with its matching vector
        const chunkEmbeddings = chunks.map((chunk, index) => ({
            text: chunk,
            embedding: chunkVectors[index],
        }));

        //Creting points to store in db -> in Qdrant we store {id, vector, payload}
        const points = chunkEmbeddings.map((item,index) =>({
            id: index + 1,
            vector: item.embedding,
            payload: {
                text: item.text
            }
        }))

        //adding in db
        //upsert is combination of insert + update 
        //take two parameters collection name and data
        await qdrant.upsert("pdf-docs",{
            points,
        })

        const question = req.body.question
        const questionEmbedding = await embeddings.embedQuery(question)

        const searchResult = await qdrant.search('pdf-docs',{
            vector: questionEmbedding,
            //limit 1 means you'll get the first similar search found
            limit: 1
        })
        const bestChunk = searchResult[0].payload.text
        const bestScore = searchResult[0].score
        console.log(searchResult)

        const response = await generationModel.invoke(`
        Answer only using the context below.
        If the answer is not in the context. Say: "i don't know." 

        Context:
        ${bestChunk}

        Question:
        ${question}
        Return only the final answer do not give the reasoning
        `)


        const rawAnswer = response.content;

        const answer = rawAnswer.includes("</think>")
            ? rawAnswer.split("</think>").pop().trim()
            : rawAnswer.trim();

        return res.json({
            question,
            answer,
            matched_chunk: bestChunk,
            similarity_score: bestScore,
        });

        
    
        //    const vectors = await createEmbeddings(chunks)
        //    console.log(vectors)
  
        // return res.json({
        //     total_chunks: chunks.length,
        //     embedding_dimension: chunkVectors[0]?.length,
        //     chunks,
        // });
    }catch (error) {
        console.error("Embedding error:", error);
  
        return res.status(500).json({
          message: "Could not process PDF embeddings",
          error: error.message,
        });
    }
  });


// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});