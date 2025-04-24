import mongoose from "mongoose";
const schema = mongoose.Schema({
    photo:{
        type:String,
    },
    title:{
        type:String,
        required:[true,"Please enter a heading"],
    },
    content:{
        type:String,
        required:[true,"Please enter content or paragraph"],
    }
},{
    timestamps:true,
});

export const Blog=mongoose.model("Blog",schema);