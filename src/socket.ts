// src/socket.ts
import { io, Socket } from "socket.io-client";
import store from "./components/store/store";

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
  const state = store.getState();
  const user = state.auth.user;

  if (!user) return;

  if (!s.connected) {
    s.once("connect", () => {
      console.log("Socket connected, registering user...");
      s.emit("register");
    });
  } else {
    s.emit("register");
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
