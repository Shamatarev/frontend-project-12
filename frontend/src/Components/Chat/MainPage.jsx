/* eslint-disable no-unused-vars */
// @ts-nocheck

import axios from 'axios';
import React, { useEffect, useState } from 'react';
// import React from 'react';
import Header from '../common/header';
import ChannelsBox from './components/channelsBox';
import MessagesBox from './components/messageBox';
// import useAuth from '../../hooks';
// import { Button } from 'react-bootstrap';
import fetchData from '../../slices/thunks'
import { useDispatch } from 'react-redux';






const MainPage = () => {
 const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchData())
  }, []);

 
  return (
    <div className="d-flex flex-column h-100">
    <Header/>
      <div className ="container h-100 my-4 overflow-hidden rounded shadow"> 
        <div className="row h-100 bg-white flex-md-row">
          <ChannelsBox/>
          <MessagesBox />
        </div>
      </div>
    </div>
  );
};

export default MainPage;