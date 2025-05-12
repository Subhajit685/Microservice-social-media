import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    roll: {
        type: String,
        enum: ['user', 'admin'],
        default: "user"
    },
    theam: {
        type: String,
        default: "light"
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    posts: [
        {
            type: Object
        }
    ],
    bookmarks: [
        {
            type: Object
        }
    ],
    notification: [
        {
            type : Object
        },
    ],
    notoficationLength : {
        type : Number,
        default : 0
    }
}, { timestamps: true })

const User = mongoose.model("User", userSchema)

export default User