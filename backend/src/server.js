const express = require("express");
//Used to upload pdf file 
const multer = require("multer")
//Used to read uploaded file
const pdfParse = require("pdf-parse")
//importing embeddings model from servies 
const embeddings = require("./services/embeddings")


const fs = require('fs')
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

app.post("/upload", upload.single("pdf"), async (req, res) => {
    try {
      const dataBuffer = fs.readFileSync(req.file.path);
      const pdfData = await pdfParse(dataBuffer);
      const text = pdfData.text;
  
      const chunks = text
         //replacing /n/n with /n for testing 
        .split("\n")
        .map((chunk) => chunk.trim())
        .filter((chunk) => chunk.length > 0);
  
      if (chunks.length === 0) {
        return res.status(400).json({
          message: "No readable text was found in this PDF",
        });
      }
  
      console.log("Chunks:", chunks);
      console.log("All chunks are strings:", chunks.every(
        (chunk) => typeof chunk === "string"
      ));
  
      const vectors = await embeddings.embedDocuments(chunks);
  
      return res.json({
        total_chunks: chunks.length,
        embedding_dimension: vectors[0]?.length,
        chunks,
      });
    } catch (error) {
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