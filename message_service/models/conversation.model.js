import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participents : [
        {
            type : Object
        }
    ],
    messages : [
        {
            type : Object
        }
    ]
}, {timestamps : true})

const Conversation = mongoose.model("Conversation", conversationSchema)

export default Conversation