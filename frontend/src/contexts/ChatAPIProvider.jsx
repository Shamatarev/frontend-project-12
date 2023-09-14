import {
  createContext, useContext, useMemo,
} from 'react';
import { useDispatch } from 'react-redux';
import {
  addChannel,
  changeChannelId,
  updateChannelData,
  removeChannel,
} from '../slices/channels';
import { addPost } from '../slices/messages';
import { AuthContext } from './AuthProvider';

const ChatApiContext = createContext({});

const ChatApiProvider = ({ socket, children }) => {
  const dispatch = useDispatch();
  const { saveUserData } = useContext(AuthContext);

  const context = useMemo(() => {
    const socketOn = () => {
      const handleNewChannel = (newChannel) => {
        dispatch(addChannel(newChannel));
        const username = saveUserData?.username;
        if (newChannel.user === username) {
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
      };

      socket.on('newChannel', handleNewChannel);
      socket.on('renameChannel', handleRenameChannel);
      socket.on('newMessage', handleNewMessage);
      socket.on('removeChannel', handleRemoveChannel);
    };

    const socketOff = () => {
      socket.off();
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

    return {
      socketOn,
      socketOff,
      sendMessage,
      newChannelAdd,
      renChannel,
      remChannel,
    };
  }, [dispatch, socket, saveUserData]);

  return (
    <ChatApiContext.Provider value={context}>
      {children}
    </ChatApiContext.Provider>
  );
};

const useChatApi = () => useContext(ChatApiContext);
export { ChatApiContext, useChatApi };
export default ChatApiProvider;
