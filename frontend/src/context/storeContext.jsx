import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const ContextProvider = ({ children }) => {
  const url = "http://apigatewaya:5000";
  const [user, setuser] = useState(null);
  const [color, setcolor] = useState("light");
  const [showcomment, setshowcomment] = useState(false);
  const [ispopup, setpopup] = useState(false);
  const [commentpopup, setcommentpopup] = useState(false);
  const [showCreate, setshowCreate] = useState(false);
  const [selectPostcomment, setselectPostcomment] = useState({});
  const [allpost, setallpost] = useState([]);
  const [userData, setuserData] = useState({});
  const [suggestionUser, setsuggestionuser] = useState([]);
  const [follewing, setfollewing] = useState(false);
  const [followers, setfollowers] = useState(false);
  const [messages, setmessages] = useState([]);
  const [shownotification, setshownotification] = useState([]);
  const [notificationCount, setnotificationCount] = useState(0);
  const [popData, setpopData] = useState(null);
  const [notificationLength, setnotificationLength] = useState(0);
  const [lengthCount, setlengthCount] = useState(0);
  const [allComment, setAllcomment] = useState([]);
  const [getPost, setgetpost] = useState(true);
  const [profiledataLoading, setprofiledataloading] = useState(false);
  const [followersShow, setfollowersShow] = useState(false);
  const [followingShow, setfollowingShow] = useState(false);


  const getUser = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${url}/user/api/user/check`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      // console.log("data",data)
      if (data.success) {
        setuser(data.user);
        localStorage.setItem("id", data.user._id)
        setcolor(data.user?.theam);
      }
    } catch (error) {
      console.log("check User", error);
    }
  };

  const addComment = async (id, comment) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${url}/post/api/post/addcomment/${id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: comment }),
      });

      const data = await res.json();
      return data;
    } catch (error) {
      console.log("addcomment", error);
    }
  };

  const like = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${url}/post/api/post/like/${id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      const data = await res.json();
      return data;
    } catch (error) {
      console.log("like", error);
    }
  };
  const dislike = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${url}/post/api/post/dislike/${id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      const data = await res.json();
      return data;
    } catch (error) {
      console.log("dislike", error);
    }
  };
  const bookmark = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${url}/post/api/post/bookmark/${id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      const data = await res.json();
      return data;
    } catch (error) {
      console.log("bookmark", error);
    }
  };

  const profiledata = async (id) => {
    const token = localStorage.getItem("token");
    setprofiledataloading(true);
    try {
      const res = await fetch(`${url}/user/api/user/profile/${id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setprofiledataloading(false);
      if (data.success) {
        const id = localStorage.getItem("id")
        console.log(id)
        setfollowingShow(false);
        setfollowersShow(false);
        data.user.following.map(item => {
          if(item._id.toString() === id.toString()){
            setfollewing(true)
          }
        });
        data.user.followers.map(item => {
          if(item._id.toString() === id.toString()){
            setfollowers(true)
          }
        })
        setuserData(data.user);
      }
    } catch (error) {
      console.log("profileData", error);
    }
  };

  const hendleSuggestion = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${url}/user/api/user/suggest`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setsuggestionuser(data.users);
      }
    } catch (error) {
      console.log("suggestion", error);
    }
  };

  const deletePost = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${url}/post/api/post/deletepost/${id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "appliction/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      const data = await res.json();
      if (data.success) {
        const newAllpost = allpost.filter((post) => post._id !== id);
        setallpost(newAllpost);
      }
    } catch (error) {
      console.log("deletePost", error);
    }
  };

  const hendletoFollow = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${url}/user/api/user/followOrUnfollow/${id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      const data = await res.json();
      if (data.success) {
        setfollewing(!follewing);
        setfollowers(!followers);
        profiledata(id);
      }
    } catch (error) {
      console.log("follow", error);
    }
  };

  const getNotification = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${url}/user/api/user/notofocation`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setnotificationLength(data.notificationLength);
        setlengthCount(data.notification.length);
        setnotificationCount(
          data.notification.length - data.notificationLength
        );
        setshownotification(data.notification.reverse());
      }
    } catch (error) {
      console.log("getNotification", error);
    }
  };
  return (
    <StoreContext.Provider
      value={{
        url,
        user,
        setuser,
        getUser,
        color,
        setcolor,
        showcomment,
        setshowcomment,
        ispopup,
        setpopup,
        commentpopup,
        setcommentpopup,
        showCreate,
        setshowCreate,
        selectPostcomment,
        setselectPostcomment,
        addComment,
        like,
        dislike,
        bookmark,
        allpost,
        setallpost,
        profiledata,
        userData,
        setuserData,
        hendleSuggestion,
        suggestionUser,
        setsuggestionuser,
        follewing,
        setfollewing,
        followers,
        setfollowers,
        messages,
        setmessages,
        shownotification,
        setshownotification,
        notificationCount,
        setnotificationCount,
        popData,
        setpopData,
        deletePost,
        hendletoFollow,
        getNotification,
        notificationLength,
        setnotificationLength,
        lengthCount,
        setlengthCount,
        allComment,
        setAllcomment,
        getPost,
        setgetpost,
        profiledataLoading,
        setprofiledataloading,
        followersShow,
        setfollowersShow,
        followingShow,
        setfollowingShow
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default ContextProvider;
