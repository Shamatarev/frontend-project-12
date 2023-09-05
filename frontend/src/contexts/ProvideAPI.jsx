import { io } from "socket.io-client";

const URL = "/";

export const socket = io(URL, { autoConnect: true });


socket.onAny((event, ...args) => {
    console.log(event, args);
  });

