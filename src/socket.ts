// src/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = (): Socket => {
  if (!socket) {
    socket = io("http://localhost:8080", {
      withCredentials: true,
      transports: ["websocket"], // use only WebSocket, no polling
      autoConnect: true,
    });
  }
  return socket;
};

export const getSocket = (): Socket => {
  if (!socket) {
    throw new Error("Socket is not initialized. Call initSocket() first.");
  }
  return socket;
};

export const connectSocket = () => {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
    console.log("Socket connected to server");
  }
};

export const registerUser = () => {
  const s = getSocket();
  console.log("socket: ",s);
  
  if (s.connected) {
    s.emit("register");
    console.log("s.connected:",s.connected);
  }
};

// Listen for notifications with type safety
export const listenForNotifications = (
  callback: (data: any) => void
) => {
  const s = getSocket();
  s.on("newNotification", callback);
};

// Cleanup listener
export const removeNotificationListener = (callback: (data: any) => void) => {
  const s = getSocket();
  s.off("newNotification", callback);
};
