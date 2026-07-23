const express = require("express");
//Used to upload pdf file 
const multer = require("multer")
//Used to read uploaded file
const pdfParse = require("pdf-parse")
//importing embeddings model from servies 
const embeddings = require("./services/embeddings")
//adding generation model 
const generationModel = require("./services/generationModel")


const fs = require('fs');
const { dot } = require("node:test/reporters");
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

// learn uploading a file in the server
// app.post('/upload',upload.single("pdf"),async (req,res) =>{
//     console.log(req.file)

//     //used to read the uploaded file this will give us binary data 
//     const dataBuffer = fs.readFileSync(req.file.path)
//     //Now we will extract the pdf text from the binary data
//     const pdfData = await pdfParse(dataBuffer)
//     //getting the text
//     const text = pdfData.text
//     // res.send(text)

//     //fixed chunking 
//     // const chunk =[];
    
//     // for(let i = 0 ; i < text.length;i+=500){
//     //     chunk.push(text.slice(i,i+500));
//     // }
//     //console.log(chunk)

//     //Paragraph based chunking
//     const chunks = text
//        .split("/n/n")
//        //removes the unwanted space from the start and end of the paragraph
//        .map((chunk) => chunk.trim)
//        //removes empty paragraph 
//        .filter(Boolean)

//     try{
//         const vectors = await embeddings.embedDocuments(chunks)


//         res.json({
//             total_chunks: chunks.length,
//             embedding_dimension: vectors[0]?.length,
//         })
//     }catch(error){
//         console.log("Embedding error:", error.cause || error)
//         res.status(500).json({
//             message: "could not create embeddings",
//             error: error.cause?.message || error.message,
//         })
//     }
    

//     res.json({
//         total_chunk: chunks.length,
//         chunks
//         //number count in one embedding vector
//         // embedding_dimension: vectors[0]?.length,
//         //all generated vectors
//         //embeddings: vectors,
//     })
// })


//Function to create Embeddings
async function createEmbeddings(chunks){
    if(!Array.isArray(chunks) || chunks.length === 0){
        throw new Error("Chunks must be a non-empty array")
    }
    return await embeddings.embedDocuments(chunks)

}
//Function to find similarity
function cosineSimilarity(vecA,vecB){
    let dotProduct = 0;
    for(let i = 0 ; i<vecA.length;i++){
        dotProduct += vecA[i] + vecB[i]
    }
    //HIger the number means more similarity lower number means not similar
    return dotProduct
}
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

        const question = req.body.question
        const questionEmbedding = await embeddings.embedQuery(question)
        //keyword retrieval 
        // const matchedChunk = chunks.find((chunk)=> chunk.toLowerCase()includes(question)
        let bestChunk = null;
        let bestScore = -Infinity;

        for(const items of chunkEmbeddings){
            const score = cosineSimilarity(questionEmbedding,items.embedding)
            if(score > bestScore){
                bestChunk = items.text;
                bestScore = score
            }
        }
        console.log(bestScore)

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
//Testing Generation Model
// app.get("/test-llm", async (req, res) => {
//     try {
//       const response = await generationModel.invoke("What is RAG?");
  
//       res.json({
//         answer: response.content,
//       });
//     } catch (error) {
//       console.error("LLM error:", error);
  
//       res.status(500).json({
//         message: "Generation model failed",
//         error: error.message,
//       });
//     }
// });



// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});