/* eslint-disable react/prop-types */
// @ts-nocheck
/* eslint-disable react/jsx-no-constructed-context-values */

import React, { useState, useEffect} from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import LoginPage from './Login/LoginPage.jsx';
import MainPage from './Chat/MainPage.jsx';
import AuthContext from '../contexts/index.jsx';
import useAuth from '../hooks/index.jsx';
import 'bootstrap/dist/css/bootstrap.min.css'; // Импорт стилей Bootstrap
const apiPath = '/api/v1';

const routes = {
  loginPath: () => [apiPath, 'login'].join('/'),
  usersPath: () => [apiPath, 'data'].join('/'),
};

const AuthProvider = ({ children }) => {
  const saveUserData = JSON.parse(localStorage.getItem('userId'))

   console.log('saveUserData',saveUserData)
   console.log(Boolean(saveUserData))
  const [loggedIn, setLoggedIn] = useState(Boolean(saveUserData));
  const [authCompleted, setAuthCompleted] = useState(false);

  const logIn = async (values) => {
    try {
      const res = await axios.post(routes.loginPath(), values);
      localStorage.setItem('userId', JSON.stringify(res.data));
      setLoggedIn(true);
      setAuthCompleted(true);
    } catch (error) {
      console.error('Authorization failed:', error);
    }
  };

  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
    setAuthCompleted(true);
  };

  useEffect(() => {
    if (!authCompleted) {
      return; // Wait until authentication is completed
    }

    if (loggedIn) {
      window.location.href = '/private';
    } else {
      window.location.href = '/login'; 
    }
  }, [authCompleted, loggedIn]);

  return (
    <AuthContext.Provider value={{ loggedIn, logIn, logOut, saveUserData }}>
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
          {/* Добавляем PrivateRoute для закрытой страницы */}
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
