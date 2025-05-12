import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text : {
        type : String,
        required : true
    },
    post : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Post',
        required : true
    },
    user : {
        type : Object,
        required : true
    }
}, {timestamps : true})

const Comment = mongoose.model("Comment", commentSchema)

export default Comment