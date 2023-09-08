import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Header from '../common/header';
import ChannelsBox from './components/channelsBox';
import MessagesBox from './components/messageBox';
import fetchData from '../../slices/thunks';

const MainPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

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
