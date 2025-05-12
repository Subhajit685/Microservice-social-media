import { publichEvent } from "../config/rabbitMq_config.js";
import User from "../models/user.model.js";

export const handleEvent = async (routingKey, data) => {
  switch (routingKey) {
    case "add_post":
      const user = await User.findById(data.postAuthor._id).select("-password");
      if (!user) {
        console.error("No user found");
      }
      user.posts.push(data);
      await user.save();
      break;

    case "add_post_notification":
      const users = await User.find({ _id: { $ne: data.id } }).select(
        "-password"
      );
      for (const followinguser of users) {
        if (followinguser.following.includes(data.id.toString())) {
          followinguser.notification.push(data);
          await followinguser.save();
          await publichEvent("add_post_noti", {id: followinguser._id.toString(), notification: data})
        }
      }
      break;

    case "like_notification":
      console.log("like_notification", data);
      const user1 = await User.findById(data.id).select("-password");
      user1.notification.push(data.notification);
      await user1.save();

      await publichEvent("add_post_noti", {id: data.id.toString(), notification: data.notificatio})

      break;

    case "delete_post":
      const user2 = await User.findById(data.id).select("-password");
      user2.posts = user2.posts.filter(
        (postID) => postID._id.toString() !== data.postID
      );
      await user2.save();
      break;

    case "bookmark":
      const user3 = await User.findById(data.id).select("-password");
      const posts = user3.bookmarks;
      let add = false;
      console.log("book", user3.bookmarks);
      posts.map(async (post) => {
        if (post._id.toString() === data.post._id.toString()) {
          console.log(post);
          user3.bookmarks = posts.filter(
            (post) => post._id.toString() !== data.post._id.toString()
          );
          console.log("book", user3.bookmarks);
          await user3.save();
          add = true;
        }
      });
      if (!add) {
        await user3.updateOne({ $addToSet: { bookmarks: data.post } });
        await user3.save();
      }
      break;

    default:
      console.log("Unknown fruit.");
  }
};
