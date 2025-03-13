import { useEffect, useState } from "react";

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>();

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3000');
    socket.onopen = () => {
      setSocket(socket);
    };
    socket.onclose = () => {
      setSocket(null);
    };
    socket.addEventListener('message', event => {
        try {
          const receivedData = JSON.parse(event.data);
          console.log('Received JSON:', receivedData);
        } catch (error) {
          console.error('Error parsing JSON:', error);
          console.log('Received data was:', event.data);
        }
      });
  }, []);
  return socket;
};
