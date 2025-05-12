import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId : {
        type : Object
    },
    resiverID : {
        type : Object
    },
    message : {
        type : String,
        required : true
    }
}, {timestamps : true})

const Message = mongoose.model("Message", messageSchema)

export default Message