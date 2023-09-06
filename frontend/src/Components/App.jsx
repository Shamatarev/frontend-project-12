/* eslint-disable react/prop-types */
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import LoginPage from './Login/LoginPage.jsx';
import Signup from './SignUp/signup.jsx'
import MainPage from './Chat/MainPage.jsx';
import useAuth from '../hooks/index.jsx';
import 'bootstrap/dist/css/bootstrap.min.css'; // Импорт стилей Bootstrap
import 'react-toastify/dist/ReactToastify.css';
import AuthProvider from '../contexts/AuthProvider.jsx';


const PrivateRoute = ({ element }) => {
  console.log("PrivateRoute element", {element})
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
