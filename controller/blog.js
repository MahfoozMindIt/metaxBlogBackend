import { Blog } from "../models/blog.js";
import { rm } from "fs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const newBlog = async (req, res, next) => {
    const{
        title,
        content
      } = req.body; 
    const photo = req.file; 

    if (!photo) {
        return res.status(400).json({ success: false, message: "Please upload a photo" });
    }

    if (!title || !content) {
        return res.status(400).json({ success: false, message: "Please enter all fields" });
    }
let slug = "";
if (title) {
    slug = title.replace(/\s+/g, "-").toLowerCase(); 
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
        return res.status(400).json({ success: false, message: "Blog with this title already exists" });
    }
}

    const blog = await Blog.create({
        title,
        content,
        slug,
        photo:`/uploads/${req.file.filename}`, 
    });

    return res.status(201).json({
        success: true,
        message: "Blog created successfully",
        blog,
    });
};


export const getBlog=async (req, res, next) => {
    let blogs= await Blog.find({}).sort({createdAt:-1});
    if(blogs){
        return res.status(200).json({
            success:false,
           blogs,
        })
    }
    if(!blogs){
        return res.status(404).json({
            success:false,
            message:"No blogs found",
        })
    }
}

export const getSingleBlog=async (req, res, next) => {
    
    const { slug } = req.params;

    
    let blog = await Blog.findOne({slug});
    if(blog){
        return res.status(200).json({
            success:true,
           blog,
        })
    }
    if(!blog){
        return res.status(404).json({
            success:false,
            message:"Blog was not found",
        })
    }
}

export const deleteBlog=async (req, res, next) => {
    
    const { id } = req.params;

    
    let blog = await Blog.findById(id);
    if (!blog) return next(new ErrorHandler("Product was not found", 404));
    rm(blog.photo, () => {
      console.log(" Product Photo Deleted");
    });
   await Blog.deleteOne(blog);
  return res.status(200).json({
    success: true,
    message: "Blog Deleted Successfully",
  });
}


export const cleanupImages = (req, res) => {
    const { urls } = req.body;
    if (!Array.isArray(urls)) return res.status(400).json({ message: 'Invalid URLs' });
  
    urls.forEach((url) => {
      const filename = path.basename(url); 
      const filepath = path.join(__dirname, '../uploads', filename);
      fs.unlink(filepath, (err) => {
        if (err) {
          console.warn(`Failed to delete ${filename}:`, err.message);
        }
      });
    });
  
    res.json({ message: 'Unused images deleted (if existed).' });
  };




  const extractImageUrls = (content) => {
    const urls = [];
    if (!content?.blocks) return urls;
  
    content.blocks.forEach((block) => {
      if (block.type === "image" && block.data?.file?.url) {
        urls.push(block.data.file.url);
      }
    });
  
    return urls;
  };
  

  export const updateBlog = async (req, res) => {
    try {
      const { id } = req.params;
      const { title } = req.body;
  
      const blog = await Blog.findById(id);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
  
      let slug = "";
      if (title) {
        slug = title.replace(/\s+/g, "-").toLowerCase();
        const existingBlog = await Blog.findOne({ slug, _id: { $ne: id } });
        if (existingBlog) {
          return res.status(400).json({ success: false, message: "Blog with this title already exists" });
        }
        blog.slug = slug; // ✅ now blog is defined
      }
  
      const newTitle = req.body.title;
      const newContent = JSON.parse(req.body.content);
      const oldContent = typeof blog.content === "string" ? JSON.parse(blog.content) : blog.content;
  
      // Extract old and new image URLs
      const oldImages = extractImageUrls(oldContent);
      const newImages = extractImageUrls(newContent);
  
      // Find and delete removed image files
      const removedImages = oldImages.filter((url) => !newImages.includes(url));
      removedImages.forEach((url) => {
        const filename = url.split("/").pop();
        const filePath = path.join("uploads", filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
  
      // Update blog fields
      blog.title = newTitle;
      blog.content = JSON.stringify(newContent);
  
      if (req.file) {
        // delete old photo if it exists
        if (blog.photo && fs.existsSync(blog.photo)) {
          fs.unlinkSync(blog.photo);
        }
  
        blog.photo = `/uploads/${req.file.filename}`; 
      }
  
      await blog.save();
  
      res.status(200).json({ success: true, blog });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Blog update failed" });
    }
  };
  

export const uploadImage = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }
  
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      
      return res.status(200).json({
        success: 1,
        file: {
          url: fileUrl,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Upload failed" });
    }
  };
  