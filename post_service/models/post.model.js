import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    caption : {
        type : String,
        default : ''
    },
    postImage : [
        {
            type : String,
            required : true
        }
    ],
    postAuthor : {
        type : Object,
        required : true
    },
    likes : [
        {
            type : Object  
        }
    ],
    comments : [
        {
            type : Object  
        }
    ]
}, {timestamps : true})

const Post = mongoose.model("Post", postSchema)

export default Post