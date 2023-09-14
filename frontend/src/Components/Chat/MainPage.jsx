import React, { useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import Header from '../common/Header';
import ChannelsBox from './components/ChannelsBox.jsx';
import MessagesBox from './components/MessageBox.jsx';
import fetchData from '../../Slices/thunks';
import { AuthContext } from '../../contexts/AuthProvider';
import { useChatApi } from '../../contexts/ChatAPIProvider';
import ModalWindow from './components/modals/ChangeModal';

const MainPage = () => {
  const { getAuthHeader } = useContext(AuthContext);
  const dispatch = useDispatch();
  const { socketOn, socketOff } = useChatApi();
  const token = getAuthHeader();

  useEffect(() => {
    dispatch(fetchData(token));
    socketOn();
    return () => {
      socketOff();
    };
  }, [dispatch, token, socketOn, socketOff]);

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
