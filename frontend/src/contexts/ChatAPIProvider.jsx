import { createContext, useContext, useMemo } from 'react';

const ChatApiContext = createContext({});

const ChatApiProvider = ({ socket, children }) => {
  const context = useMemo(() => {
    const socketOn = (event, callback) => {
      socket.on(event, callback);
    };

    const socketOff = (event, callback) => {
      socket.off(event, callback);
    };

    const sendMessage = (message) => {
      socket.emit('newMessage', message);
    };

    const newChannelAdd = (newChannel) => {
      socket.emit('newChannel', newChannel);
    };

    const removeChannel = (channelID) => {
      socket.emit('removeChannel', channelID);
    };

    const renameChannel = (newChannel) => {
      socket.emit('renameChannel', newChannel);
    };

    return {
      socketOn,
      socketOff,
      sendMessage,
      newChannelAdd,
      renameChannel,
      removeChannel,
    };
  }, [socket]);

  return (
    <ChatApiContext.Provider value={context}>
      {children}
    </ChatApiContext.Provider>
  );
};

const useChatApi = () => useContext(ChatApiContext);
export { ChatApiContext, useChatApi };
export default ChatApiProvider;
