import React, { useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { AuthContext } from '../../contexts/AuthProvider';
import { useChatApi } from '../../contexts/ChatAPIProvider';
import {
  addChannel,
  changeChannelId,
  updateChannelData,
  removeChannel,
} from '../../slices/channels';
import { addPost } from '../../slices/messages';
import Header from '../common/Header';
import ChannelsBox from './components/ChannelsBox.jsx';
import MessagesBox from './components/MessageBox.jsx';
import fetchData from '../../slices/thunks';
import ModalWindow from './components/modals/ChangeModal';

const MainPage = () => {
  const { getAuthHeader, saveUserData } = useContext(AuthContext);
  const dispatch = useDispatch();
  const { socketOn, socketOff } = useChatApi();
  const token = getAuthHeader();

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
      dispatch(removeChannel(id));
    };

    socketOn('newChannel', handleNewChannel);
    socketOn('renameChannel', handleRenameChannel);
    socketOn('newMessage', (handleNewMessage));
    socketOn('removeChannel', (handleRemoveChannel));

    dispatch(fetchData(token));

    return () => {
      socketOff('newChannel', handleNewChannel);
      socketOff('renameChannel', handleRenameChannel);
      socketOff('newMessage', (handleNewMessage));
      socketOff('removeChannel', (handleRemoveChannel));
    };
  }, [dispatch, token, socketOn, socketOff, saveUserData]);

  return (

    <div className="d-flex flex-column h-100">
      <ModalWindow />
      <Header />
      <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg`-white flex-md-row">
          <ChannelsBox />
          <MessagesBox />
        </div>
      </div>
    </div>

  );
};

export default MainPage;
