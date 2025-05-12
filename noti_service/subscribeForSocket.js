import { io, onlineUser } from "./socket/socket.js";

export const handleEvent = async (routingKey, data) => {
    switch (routingKey) {
        case "message":
            const getonlineUser = onlineUser(data.id)

            if (getonlineUser) {
                io.to(getonlineUser).emit("newMessage", data.newMessage)
            }
            break;
        case "add_post_noti":

            const sendNotification = onlineUser(data.id.toString())

            if (sendNotification) {
                io.to(sendNotification).emit("notification", data.notification)
            }


    }

}