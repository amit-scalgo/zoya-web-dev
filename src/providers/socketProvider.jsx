import { useSocketStore } from "@/lib/store/socket.store";
import { useUserStore } from "@/lib/store/user.store";
import { useEffect, useCallback } from "react";
import io from "socket.io-client";

export const SocketProvider = ({ children }) => {
  const { setSocket } = useSocketStore();
  const { userInfo, setOnlineUsers } = useUserStore();

  const initializeSocket = useCallback(() => {
    try {
      const socket = io(import.meta.env.VITE_SOCKET_URL, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        timeout: 10000,
      });

      setSocket(socket);
      return socket;
    } catch (error) {
      console.error("Socket initialization failed:", error);
      return null;
    }
  }, [setSocket]);

  useEffect(() => {
    if (!userInfo?._id) return;

    const socket = initializeSocket();
    if (!socket) return;

    const handleConnect = () => {
      socket.emit("add-user", userInfo._id);
      console.log("Socket connected successfully");
    };

    const handleDisconnect = (reason) => {
      console.log("Socket disconnected:", reason);
      socket.emit("signout", userInfo._id);
      setOnlineUsers([]);
    };

    const handleOnlineUsers = ({ onlineUsers }) => {
      setOnlineUsers(onlineUsers);
    };

    // Event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("online-users", handleOnlineUsers);

    // Cleanup function
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("online-users", handleOnlineUsers);
      socket.disconnect();
    };
  }, [userInfo?._id, initializeSocket, setOnlineUsers]);

  return children;
};
