import express from "express";
import { deleteBlog, getBlog, getSingleBlog, newBlog } from "../controller/xpdBlog.js";
import { singleUpload } from "../middleware/multer.js";
const app = express.Router();

app.post("/new",singleUpload,newBlog);
app.get("/allBlogs",getBlog);
app.get("/:id",getSingleBlog);
app.delete("/:id",deleteBlog);

export default app;