import express from "express";
import { cleanupImages, deleteBlog, getBlog, getSingleBlog, newBlog, updateBlog, uploadImage } from "../controller/xpdBlog.js";
import { editorImageUpload, singleUpload } from "../middleware/multer.js";
const app = express.Router();
app.post("/upload", singleUpload, (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }
  
    // Return the URL of the uploaded image
    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    return res.status(200).json({
      success: true,
      url: imageUrl,
    });
  });
  
app.post('/update-image', editorImageUpload, uploadImage);

app.post("/cleanup-images",cleanupImages);
app.post("/new",singleUpload,newBlog);
app.put("/update/:id",singleUpload,updateBlog);
app.get("/allBlogs",getBlog);
app.get("/:slug",getSingleBlog);
app.delete("/:id",deleteBlog);

export default app;