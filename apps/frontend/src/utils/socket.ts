// socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = (token: string): Socket => {
  // If socket already exists, optionally disconnect and recreate it if token has changed
  if (socket) {
    // Optionally check if token has changed or force a reinitialize
    socket.disconnect();
  }
  
  socket = io('http://localhost:3000', {
    transports: ['websocket'],
    query: { token },
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;
