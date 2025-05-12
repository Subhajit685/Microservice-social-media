import express from "express";
import userProtected from "../middleware/userProtected.js";
import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import multer from "multer";
import { publichEvent } from "../config/rabbitMq_config.js";
import { client } from "../config/redis.js";
const upload = multer({ storage: multer.memoryStorage() });

const route = express.Router();

route.post(
  "/newpost",
  userProtected,
  upload.single("postImage"),
  async (req, res) => {
    try {
      const { caption } = req.body;
      const postImage = req.file;
      const postAuthor = req.user;

      if (!postImage) {
        return res.status(400).json({
          success: false,
          message: "You must post a image on your post",
        });
      }
      const imageToBuffer = await sharp(postImage.buffer)
        .resize({ width: 800, height: 800, fit: "inside" })
        .toFormat("jpeg", { quality: 100 })
        .toBuffer();

      const fileuri = `data:image/jpeg;base64,${imageToBuffer.toString(
        "base64"
      )}`;
      const cloudinaryResponse = await cloudinary.uploader.upload(fileuri);

      const newpost = await Post({
        caption: caption ? caption : "",
        postImage: cloudinaryResponse.secure_url,
        postAuthor,
      });

      await newpost.save();

      const notification = {
        message: `${postAuthor.userName} add a post`,
        userImage: postAuthor?.profileImage,
        id: postAuthor._id,
      };

      // rabbitmq featuer

      await publichEvent("add_post", newpost);
      await publichEvent("add_post_notification", notification);

      await client.del("posts");

      return res
        .status(200)
        .json({ success: true, message: "New post add", newpost });
    } catch (error) {
      console.log("newpost", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error on newpost" });
    }
  }
);

route.get("/allpost", userProtected, async (req, res) => {
  try {
    const allpost_redis = await client.get("posts");
    if (allpost_redis) {
      console.log("from redis");
      return res
        .status(200)
        .json({ success: true, allPost: JSON.parse(allpost_redis) });
    }
    const allpost = await Post.find({}).sort({ createdAt: -1 });
    await client.set("posts", JSON.stringify(allpost));
    console.log("from database");
    return res.status(200).json({ success: true, allPost: allpost });
  } catch (error) {
    console.log("allpost", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error on allpost" });
  }
});

route.get("/getPost", userProtected, async (req, res) => {
  try {
    const allpost = await Post.find({
      "postAuthor._id": req.user._id.toString(),
    }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, allPost: allpost });
  } catch (error) {
    console.log("getPost", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error on getPost" });
  }
});

route.post("/like/:id", userProtected, async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    const user = req.user;

    if (!post) {
      return res
        .status(400)
        .json({ success: false, message: "Post not found" });
    }

    await post.updateOne({ $addToSet: { likes: req.user } });

    await post.save();

    // RabbitMq configeration

    const notification = {
      message: `${user.userName} like on your post ${post.caption}`,
      userImage: user?.profileImage,
      id: user._id,
    };
    console.log(post.postAuthor);
    await publichEvent("like_notification", {
      notification: notification,
      id: post.postAuthor._id,
    });

    return res.status(200).json({ success: true, message: "Like" });
  } catch (error) {
    console.log("like", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error on like" });
  }
});

route.post("/dislike/:id", userProtected, async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res
        .status(400)
        .json({ success: false, message: "Post not found" });
    }

    await post.updateOne({ $pull: { likes: req.user } });

    await post.save();

    return res.status(200).json({ success: true, message: "DisLike" });
  } catch (error) {
    console.log("dislike", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error on dislike" });
  }
});

route.post("/addcomment/:id", userProtected, async (req, res) => {
  try {
    const { text } = req.body;
    const { id } = req.params;

    if (!text) {
      return res
        .status(400)
        .json({ success: false, message: "You not comment any text" });
    }

    const post = await Post.findById(id);
    const user = req.user;

    if (!post) {
      return res
        .status(400)
        .json({ success: false, message: "Post not found" });
    }

    const newComment = await Comment.create({
      text,
      post: id,
      user: req.user,
    });

    post.comments.push(newComment);
    await post.save();

    // socket io

    // rabbitMq configuration

    const notification = {
      message: `${user.userName} comment on your post ${post.caption}`,
      userImage: user?.profileImage,
      id: user._id,
    };

    await publichEvent("like_notification", {
      notification: notification,
      id: post.postAuthor._id,
    });

    return res.status(200).json({
      message: "Comment Added",
      newComment,
      success: true,
    });
  } catch (error) {
    console.log("addcomment", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error on addcomment" });
  }
});

route.get("/getcomment/:id", userProtected, async (req, res) => {
  try {
    const { id } = req.params;
    const allcomment = await Comment.find({ post: id }).sort({ createdAt: -1 });
    return res.status(200).json({
      allcomment,
      success: true,
    });
  } catch (error) {
    console.log("getcomment", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error on getcomment" });
  }
});

route.post("/deletepost/:id", userProtected, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(400).json({ success: false, message: "No post found" });
    }
    console.log("post", post.postAuthor._id, "user", req.user._id);

    if (post.postAuthor._id.toString() !== req.user._id.toString()) {
      return res
        .status(400)
        .json({ success: false, message: "you can not delete this post" });
    }

    await Post.findByIdAndDelete(id);

    const user = req.user;

    user.posts = user.posts.filter((postID) => postID._id.toString() !== id);

    // rabbitMq con for delete post under the user

    await publichEvent("delete_post", {
      postID: post._id,
      id: post.postAuthor._id.toString(),
    });

    await Comment.deleteMany({ post: id });

    return res.status(200).json({
      success: true,
      message: "Post deleted",
    });
  } catch (error) {
    console.log("deletepost", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error on deletepost" });
  }
});

route.post("/bookmark/:id", userProtected, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    if (!user) {
      return res.status(400).json({ success: true, message: "User not found" });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(400).json({ success: true, message: "Post not found" });
    }

    // rabbitMq con

    await publichEvent("bookmark", { post: post, id: req.user._id });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log("deletepost", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error on deletepost" });
  }
});

export default route;
