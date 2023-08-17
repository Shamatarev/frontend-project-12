/* eslint-disable react/prop-types */
// @ts-nocheck
/* eslint-disable react/jsx-no-constructed-context-values */

import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  // eslint-disable-next-line no-unused-vars
  Link,
  Navigate,
  //useLocation,
} from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { Button, Navbar, Nav } from 'react-bootstrap';
import LoginPage from './Components/LoginPage.jsx';
import MainPage from './Components/MainPage.jsx';
import AuthContext from './contexts/index.jsx';
import useAuth from './hooks/index.jsx';
import 'bootstrap/dist/css/bootstrap.min.css'; // Импорт стилей Bootstrap

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

const PrivateRoute = ({ element }) => {
  const auth = useAuth();

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
