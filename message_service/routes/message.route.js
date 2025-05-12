import express from "express";
import userProtected from "../middleware/userProtected.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { consumeEvent, publichEvent } from "../config/rabbitMq_config.js";
import axios from "axios";

const route = express.Router();

route.post("/sendmessage/:id", userProtected, async (req, res) => {
  try {
    const { message } = req.body;
    const senderId = req.user._id;
    const resiverID = req.params.id;

    if (!message) {
      return res
        .status(400)
        .json({ success: false, message: "You not type any message" });
    }

    let conversation = await Conversation.findOne({
      participents: { $all: [senderId, resiverID] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participents: [senderId, resiverID],
      });
    }

    const newMessage = await Message.create({
      senderId,
      resiverID,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    await publichEvent("message", { id: resiverID, newMessage: newMessage });

    return res.status(201).json({
      success: true,
      newMessage,
    });
  } catch (error) {
    console.log("sendmessage", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error on sendmessage",
    });
  }
});

route.get("/getmessage/:id", userProtected, async (req, res) => {
  try {
    const senderId = req.user._id;
    const resiverID = req.params.id;

    const conversation = await Conversation.findOne({
      participents: { $all: [senderId, resiverID] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json({ success: true, message: [] });
    }

    return res
      .status(200)
      .json({ success: true, message: conversation.messages });
  } catch (error) {
    console.log("getmessage", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error on getmessage" });
  }
});

route.get("/messageUser", userProtected, async (req, res) => {
  try {
    const responce = await fetch(
      `${process.env.BASE_URL}/user/api/user/get_user/${req.user._id}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const users = await responce.json();
    const owner = users.data.user;
    const messageUser = [];
    for (let user of users.data.users) {
      if (
        owner.followers.includes(user._id.toString()) &&
        user.followers.includes(owner._id.toString())
      ) {
        messageUser.push(user);
      }
    }

    // console.log(messageUser)

    if (!messageUser) {
      return res.status(200).json({ success: true, users: [] });
    }

    return res.status(200).json({ success: true, users: messageUser });
  } catch (error) {
    console.log("messageUser", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error on messageUser",
    });
  }
});

export default route;
