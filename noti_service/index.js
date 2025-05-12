import express from "express"
import dotenv from "dotenv"
import { app, server} from "./socket/socket.js"
import { consumeEvent, getconnection } from "./rabbitMq_config.js"
import { handleEvent } from "./subscribeForSocket.js"
dotenv.config()

const port = process.env.PORT


server.listen(port, async()=>{
    await getconnection()
    await consumeEvent(handleEvent)
    console.log(`Noti server listen at port ${port}`)
})
