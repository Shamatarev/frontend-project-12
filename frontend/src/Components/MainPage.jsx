// @ts-nocheck

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/index.jsx';
import { Button } from 'react-bootstrap';

const apiPath = '/api/v1';

const routes = {
  loginPath: () => [apiPath, 'login'].join('/'),
  usersPath: () => [apiPath, 'data'].join('/'),
};

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const AuthButton = () => {
  const auth = useAuth();

  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut} type="button" className="btn btn-primary">Выйти</Button>
      : null
  );
};

const MainPage = () => {
  const [content, setContent] = useState({ channels: [], messages: [], currentChannelId: null });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get(routes.usersPath(), { headers: getAuthHeader() });
        setContent(data);
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    fetchContent();
  }, []);

  const { channels, messages, currentChannelId } = content;

  
  return (
    <div>
      <div className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
        <div className="container">
          <a className="navbar-brand" href="/">Hexlet Chat</a>
          <AuthButton />
        </div>
      </div>


      <h2>Channels</h2>
      <ul>
        {channels.map(channel => (
          <li key={channel.id}>{channel.name}</li>
        ))}
      </ul>

      <h2>Messages</h2>
      <ul>
        {messages.map(message => (
          <li key={message.id}>{message.text}</li>
        ))}
      </ul>

      <h2>Current Channel</h2>
      <p>{currentChannelId}</p>

    </div>
  );
};

export default MainPage;