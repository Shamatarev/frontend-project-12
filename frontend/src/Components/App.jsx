/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */



import React, { useState, useEffect} from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import LoginPage from './Login/LoginPage.jsx';
import Signup from './SignUp/signup.jsx'
import MainPage from './Chat/MainPage.jsx';
//import Signup from './SignUp/signup.jsx';
import AuthContext from '../contexts/index.jsx';
import useAuth from '../hooks/index.jsx';
import 'bootstrap/dist/css/bootstrap.min.css'; // Импорт стилей Bootstrap
import { socket }  from "../contexts/ProvideAPI";
import { removeChannel } from "../slices/channels.js";
import { removeMessagesByChannelId } from '../slices/messages';
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
const apiPath = '/api/v1';

const routes = {
  loginPath: () => [apiPath, 'login'].join('/'),
  usersPath: () => [apiPath, 'data'].join('/'),
};

const AuthProvider = ({ children }) => {
  const saveUserData = JSON.parse(localStorage.getItem('userId'))
  const {t} = useTranslation()
   console.log('saveUserData',saveUserData)
   console.log(Boolean(saveUserData))
  const [loggedIn, setLoggedIn] = useState(Boolean(saveUserData));
  const [authCompleted, setAuthCompleted] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false); // Добавляем состояние для успешной авторизации

  // eslint-disable-next-line no-unused-vars
  const [currentUser, setCurrentUser] = useState(null); // Добавляем состояние для текущего пользователя

    const handleConnectionError = () => {
    // Выводим сообщение об ошибке соединения
    toast.error(t('noConnection'));
  };

  // const handleConnectionTokenError = () => {
  //   // Выводим сообщение об ошибке соединения
  //   toast.error(t('fetchDataError'));
  // };
  const logIn = async (values) => {

    axios.get(routes)
      .then(response => {
        if (response.status === 200) {
          console.log('Сервер доступен, есть интернет.');
        } else {
          console.log('Проблемы с сервером или интернетом.');
        }
      })
      .catch(error => {
        console.error('Ошибка при запросе:', error);
        handleConnectionError()
      });

  
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
    }
  };



  // socket.on('error', (error) => {
  //   console.error('Ошибка сокса:', error);
  //   handleConnectionTokenError(); // Вызываем функцию вывода сообщения об ошибке
  // });
  
  
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

  
  const dispatch = useDispatch()


  useEffect(() => {
    socket.on('removeChannel', (id) => {
      console.log('Сообщение с сервера:', id); // Выводим id  в консоль 
      dispatch(removeChannel(id));
      //console.log('newChannel.id', channelID)
      dispatch(removeMessagesByChannelId(id));
    });
  }, [])


  return (
    <AuthContext.Provider value={{ loggedIn, logIn, logOut, saveUserData}}>
      {children}
    </AuthContext.Provider>
  );
};

const PrivateRoute = ({ element }) => {
  const auth = useAuth();
  console.log(13123131, auth.loggedIn)
  // Если пользователь не авторизован, перенаправляем на страницу логина
  if (!auth.loggedIn) {
    return <Navigate to="/login" />;
  }
  
  return element;
};

const App = () => (
  <AuthProvider>
    <Router>
      <div className="d-flex flex-column h-100">
        <Routes>
          {/* Добавляем PrivateRoute для главной страницы */}
          <Route path="/" element={<PrivateRoute element={<MainPage />} />} />
          <Route path="/login" element={<LoginPage /> } />
          <Route path="/signup" element={<Signup /> } />

          <Route
            path="/private"
            element={<PrivateRoute element={<MainPage />} />}
          />
        </Routes>
      </div>
    </Router>
  </AuthProvider>
);

export default App;
