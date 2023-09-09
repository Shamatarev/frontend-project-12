/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable no-unused-vars */
/* eslint-disable import/order */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthContext from './index.jsx';
import 'bootstrap/dist/css/bootstrap.min.css'; // Импорт стилей Bootstrap
import socket from './ProvideAPI';
import { removeChannel } from '../Slices/channels.js';
import { removeMessagesByChannelId } from '../Slices/messages.js';
import { useDispatch } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';

const apiPath = '/api/v1';

const routes = {
  loginPath: () => [apiPath, 'login'].join('/'),
  usersPath: () => [apiPath, 'data'].join('/'),
};

const AuthProvider = ({ children }) => {
  const saveUserData = JSON.parse(localStorage.getItem('userId'));
  // const {t} = useTranslation()
  //  console.log('saveUserData',saveUserData)
  //  console.log(Boolean(saveUserData))
  const [loggedIn, setLoggedIn] = useState(Boolean(saveUserData));
  const [authCompleted, setAuthCompleted] = useState(false);
  // Добавляем состояние для успешной авторизации
  const [authSuccess, setAuthSuccess] = useState(false);
  // Добавляем состояние для текущего пользователя
  const [currentUser, setCurrentUser] = useState(null);
  const [authError, setAuthError] = useState(null);
  //     const handleConnectionError = () => {
  //     // Выводим сообщение об ошибке соединения
  //     toast.error(t('noConnection'));
  //   };

  // const handleConnectionTokenError = () => {
  //   // Выводим сообщение об ошибке соединения
  //   toast.error(t('fetchDataError'));
  // };
  const logIn = async (values) => {
    // axios.get(routes)
    //   .then(response => {
    //     if (response.status === 200) {
    //       console.log('Сервер доступен, есть интернет.');
    //     } else {
    //       console.log('Проблемы с сервером или интернетом.');
    //     }
    //   })
    //   .catch(error => {
    //     console.error('Ошибка при запросе:', error);
    //     handleConnectionError()
    //   });

    try {
      const res = await axios.post(routes.loginPath(), values);
      localStorage.setItem('userId', JSON.stringify(res.data));
      setLoggedIn(true);
      setAuthSuccess(true); // Устанавливаем флаг успешной авторизации
      setAuthCompleted(true);
      // Устанавливаем имя пользователя в контекст после успешной аутентификации
      setCurrentUser(values.username);
    } catch (error) {
      console.error('Authorization failed:', error);
      setAuthError(error);
    }
  };

  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
    setAuthSuccess(false); // Сбрасываем флаг успешной авторизации
    setAuthCompleted(true);
  };

  useEffect(() => {
    if (!authCompleted) {
      return; // Wait until authentication is completed
    }

    if (authSuccess) {
      window.location.href = '/'; // Перенаправляем на главную страницу после успешной авторизации
    } else if (!loggedIn) {
      window.location.href = '/login';
    }
  }, [authCompleted, loggedIn, authSuccess]);

  const dispatch = useDispatch();

  useEffect(() => {
    socket.on('removeChannel', (id) => {
      console.log('Сообщение с сервера:', id); // Выводим id  в консоль
      dispatch(removeChannel(id));
      // console.log('newChannel.id', channelID)
      dispatch(removeMessagesByChannelId(id));
    });
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{
      loggedIn, logIn, logOut, saveUserData,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
