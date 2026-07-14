const express = require("express");
//Used to upload pdf file 
const multer = require("multer")
//Used to read uploaded file
const pdfParse = require("pdf-parse")


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

// uploading a file in the server
app.post('/upload',upload.single("pdf"),async (req,res) =>{
    console.log(req.file)

    //used to read the uploaded file this will give us binary data 
    const dataBuffer = fs.readFileSync(req.file.path)
    //Now we will extract the pdf text from the binary data
    const pdfData = await pdfParse(dataBuffer)
    //getting the text
    const text = pdfData.text

    res.send(text)
})

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});