import { rm } from "fs";
import { XCardBlog } from "../models/xCardBlog.js";

export const newBlog = async (req, res, next) => {
    const { title, content } = req.body;
    const photo = req.file; 

    if (!photo) {
        return res.status(400).json({ success: false, message: "Please upload a photo" });
    }

    if (!title || !content) {
        return res.status(400).json({ success: false, message: "Please enter all fields" });
    }

    const blog = await XCardBlog.create({
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
    let blogs= await XCardBlog.find({}).sort({createdAt:-1});
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

    
    let blog = await XCardBlog.findById(id);
    if(blog){
        return res.status(200).json({
            success: true,
            blog,
        });
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

    
    let blog = await XCardBlog.findById(id);
    if (!blog) return next(new ErrorHandler("Product was not found", 404));
    rm(blog.photo, () => {
      console.log(" Product Photo Deleted");
    });
   await XCardBlog.deleteOne();
  return res.status(200).json({
    success: true,
    message: "Blog Deleted Successfully",
  });
}