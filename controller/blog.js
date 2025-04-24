import { Blog } from "../models/blog.js";
import { rm } from "fs";

export const newBlog = async (req, res, next) => {
    const { title, content } = req.body;
    const photo = req.file; 

    if (!photo) {
        return res.status(400).json({ success: false, message: "Please upload a photo" });
    }

    if (!title || !content) {
        return res.status(400).json({ success: false, message: "Please enter all fields" });
    }

    const blog = await Blog.create({
        title,
        content,
        photo: photo.path, 
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
    
    const { id } = req.params;

    
    let blog = await Blog.findById(id);
    if(blog){
        return res.status(200).json({
            success:false,
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
   await Blog.deleteOne();
  return res.status(200).json({
    success: true,
    message: "Blog Deleted Successfully",
  });
}