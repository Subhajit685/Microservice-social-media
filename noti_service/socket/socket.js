import {Server} from "socket.io"
import express from "express"
import http from "http"

const app = express()

const server = http.createServer(app)

const io = new Server(server, {
    cors : {
        origin : ["http://frontend:5173"],
        methods : ["GET", "POST"]
    }
})


const getOnlineUserMap = {}

export const onlineUser = (resiverID) =>{
    return getOnlineUserMap[resiverID]
}

io.on("connection", (socket)=>{
    const userID = socket.handshake.query.userID
    getOnlineUserMap[userID] = socket.id
    console.log(userID)

    io.emit("getOnlineUser", Object.keys(getOnlineUserMap))

    socket.on("disconnect", ()=>{
        delete getOnlineUserMap[userID]
        io.emit("getOnlineUser", Object.keys(getOnlineUserMap))
    })
})

export {app, io, server}