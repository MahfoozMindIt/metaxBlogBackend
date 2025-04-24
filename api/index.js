import express from "express";
import bodyParser from "body-parser";
import cors from "cors"; 
import { config } from "dotenv";
import connectDB from "../database/db.js";
import blogRoute from "../routes/blog.js"
import xpdBlogRoute from "../routes/xpdBlog.js"
import xCardBlogRoute from "../routes/xCardBlog.js"



config({
    path: "../.env",
  });

  const mongoUri=process.env.MONGO_URI
  const PORT = process.env.PORT;

connectDB(mongoUri)
const app=express();


app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

app.get("/",(req,res)=>{
  res.send("API is working")
})

app.use("/api/v1/blog",blogRoute)
app.use("/api/v1/xpd-blog",xpdBlogRoute)
app.use("/api/v1/xcard-blog",xCardBlogRoute)
app.use('/uploads', express.static('uploads'));

 
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});