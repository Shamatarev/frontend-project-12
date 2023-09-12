/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable no-unused-vars */
/* eslint-disable import/order */
import React, {
  useState, useEffect, createContext, useContext,
} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Импорт стилей Bootstrap
import { removeChannel } from '../Slices/channels.js';

import { useDispatch } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import routes from './routes';

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const saveUserData = JSON.parse(localStorage.getItem('userId'));
  // const {t} = useTranslation()
  console.log('saveUserData', saveUserData);
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
  const registerUser = async (values) => {
    try {
      const res = await axios.post(routes.signUpPath(), values);
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

  const getAuthHeader = () => {
    const userId = JSON.parse(localStorage.getItem('userId'));

    if (userId && userId.token) {
      return { Authorization: `Bearer ${userId.token}` };
    }

    return {};
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

  return (
    <AuthContext.Provider value={{
      loggedIn, logIn, logOut, registerUser, getAuthHeader, saveUserData,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);
export { AuthContext, useAuth };
export default AuthProvider;
