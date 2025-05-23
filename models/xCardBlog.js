import mongoose from "mongoose";
const schema = mongoose.Schema({
    photo:{
        type:String,
    },
    title:{
        type:String,
        required:[true,"Please enter a heading"],
    },
    slug:{
        type:String,
    },
    content:{
        type:Object,
        required:[true,"Please enter content or paragraph"],
    }
},{
    timestamps:true,
});

export const XCardBlog = mongoose.model("XCardBlog",schema);