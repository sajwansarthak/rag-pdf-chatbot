const express = require("express");
const multer = require("multer")

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
app.post('/upload',upload.single("pdf"),(req,res) =>{
    console.log(req.file)
    res.send("file uploaded successfully")
})

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});