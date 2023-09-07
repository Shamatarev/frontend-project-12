/* eslint-disable functional/no-expression-statement */
/* eslint-disable import/prefer-default-export */
import { io } from 'socket.io-client';

const URL = '/';

export const socket = io(URL, { autoConnect: true });

socket.onAny((event, ...args) => {
  console.log(event, args);
});
