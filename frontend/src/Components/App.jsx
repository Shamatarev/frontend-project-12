import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import LoginPage from './Login/LoginPage.jsx';
import Signup from './SignUp/SignUp.jsx';
import MainPage from './Chat/MainPage.jsx';
import AuthProvider, { useAuth } from '../contexts/AuthProvider';
import NotFound from './Errors/NotFound.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

const PrivateRoute = ({ element }) => {
  const auth = useAuth();
  // Если пользователь не авторизован, перенаправляем на страницу логина
  return !auth.loggedIn ? <Navigate to="/login" /> : element;
};

const App = () => (
  <AuthProvider>
    <Router>
      <div className="d-flex flex-column h-100">
        <Routes>
          <Route path="/" element={<PrivateRoute element={<MainPage />} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/private"
            element={<PrivateRoute element={<MainPage />} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  </AuthProvider>
);

export default App;
