import { useEffect } from 'react';
import socket from './ProvideAPI';
import {
  addChannel, changeChannelId, updateChannelData, removeChannel,
} from '../Slices/channels';
import { addPost, removeMessagesByChannelId } from '../Slices/messages';

const useSocket = (saveUserData, dispatch) => {
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

    // Важно отписываться от событий при размонтировании компонента
    return () => {
      socket.off('newChannel', handleNewChannel);
      socket.off('renameChannel', handleRenameChannel);
      socket.off('newMessage', handleNewMessage);
      socket.off('removeChannel', handleRemoveChannel);
    };
  }, [dispatch, saveUserData.username]);
};

export default useSocket;
