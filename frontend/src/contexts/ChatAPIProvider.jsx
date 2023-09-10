/* eslint-disable react-hooks/exhaustive-deps */
import {
  createContext, useContext, useEffect, useMemo,
} from 'react';
import { useDispatch } from 'react-redux';
import {
  addChannel,
  changeChannelId,
  updateChannelData,
  removeChannel,
} from '../Slices/channels';
import { addPost, removeMessagesByChannelId } from '../Slices/messages';
import { AuthContext } from './AuthProvider';

const ChatApiContext = createContext({});

const ChatApiProvider = ({ socket, children }) => {
  const useSocket = () => {
    const dispatch = useDispatch();
    const { saveUserData } = useContext(AuthContext);
    useEffect(() => {
      const handleNewChannel = (newChannel) => {
        dispatch(addChannel(newChannel));
        if (newChannel.user === saveUserData.username) {
          dispatch(changeChannelId(newChannel.id));
        }
      };

      const handleRenameChannel = (updChannel) => {
        dispatch(updateChannelData(updChannel));
      };

      const handleNewMessage = (newMessage) => {
        dispatch(addPost(newMessage));
      };

      const handleRemoveChannel = (id) => {
        console.log('Сообщение с сервера:', id);
        dispatch(removeChannel(id));
        dispatch(removeMessagesByChannelId(id));
      };

      socket.on('newChannel', handleNewChannel);
      socket.on('renameChannel', handleRenameChannel);
      socket.on('newMessage', handleNewMessage);
      socket.on('removeChannel', handleRemoveChannel);

      // Отписываемся при размонтировании компонента
      return () => {
        socket.off('newChannel', handleNewChannel);
        socket.off('renameChannel', handleRenameChannel);
        socket.off('newMessage', handleNewMessage);
        socket.off('removeChannel', handleRemoveChannel);
      };
    }, [dispatch]);
  };
  const sendMessage = (message) => {
    socket.emit('newMessage', message);
  };
  const newChannelAdd = (newChannel) => {
    socket.emit('newChannel', newChannel);
  };
  const remChannel = (channelID) => {
    socket.emit('removeChannel', channelID);
  };
  const renChannel = (newChannel) => {
    socket.emit('renameChannel', newChannel);
  };

  const context = useMemo(() => ({
    useSocket,
    sendMessage,
    newChannelAdd,
    renChannel,
    remChannel,
  }), [useSocket, sendMessage, newChannelAdd, renChannel, remChannel]);

  return (
    <ChatApiContext.Provider value={context}>
      {children}
    </ChatApiContext.Provider>
  );
};

const useChatApi = () => useContext(ChatApiContext);
export { ChatApiContext, useChatApi };
export default ChatApiProvider;
