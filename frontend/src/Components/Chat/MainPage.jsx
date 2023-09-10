import React, { useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import Header from '../common/Header';
import ChannelsBox from './components/ChannelsBox.jsx';
import MessagesBox from './components/MessageBox.jsx';
import fetchData from '../../Slices/thunks';
import { AuthContext } from '../../contexts/AuthProvider';
import useSocket from '../../contexts/useSocket';

const MainPage = () => {
  const dispatch = useDispatch();
  const { saveUserData } = useContext(AuthContext);

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  useSocket(saveUserData, dispatch);

  return (
    <div className="d-flex flex-column h-100">
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
