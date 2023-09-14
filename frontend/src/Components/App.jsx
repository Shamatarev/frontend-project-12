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
import routes from '../routes.js';

const PrivateRoute = ({ element }) => {
  const auth = useAuth();
  return !auth.loggedIn ? <Navigate to="/login" /> : element;
};

const AuthRoute = ({ element }) => {
  const auth = useAuth();
  return auth.loggedIn ? <Navigate to={routes.rootPage} /> : element;
};

const App = () => (
  <AuthProvider>
    <Router>
      <div className="d-flex flex-column h-100">
        <Routes>
          <Route path={routes.rootPage} element={<PrivateRoute element={<MainPage />} />} />
          <Route path={routes.loginPage} element={<AuthRoute element={<LoginPage />} />} />
          <Route path={routes.signupPage} element={<AuthRoute element={<Signup />} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  </AuthProvider>
);

export default App;
