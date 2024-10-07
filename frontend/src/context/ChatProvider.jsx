import React, { createContext, useContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import io from "socket.io-client";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (user) {
      const newSocket = io("http://localhost:3000", {
        transports: ["websocket", "polling"],
        withCredentials: true,
      });
      setSocket(newSocket);
      newSocket.emit("setup", user);

      newSocket.on("connected", () => {
        console.log("Connected to Socket.io server");
      });

      return () => newSocket.close();
    }
  }, [user]);

  const fetchChats = async () => {
    try {
      setIsChatLoading(true);
      const config = {
        headers: { authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
      setIsChatLoading(false);
    } catch (error) {
      toast.error("Failed to fetch chats from API.", {
        theme: "dark",
      });
      setIsChatLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        fetchChats,
        isChatLoading,
        notifications,
        setNotifications,
        socket,
      }}
    >
      <ToastContainer />
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => useContext(ChatContext);
