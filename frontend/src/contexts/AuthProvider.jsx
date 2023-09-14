import React, {
  useState, createContext, useContext, useMemo,
} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Импорт стилей Bootstrap
import 'react-toastify/dist/ReactToastify.css';
import routes from './routes';

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const saveUserData = JSON.parse(localStorage.getItem('userId'));
  const [loggedIn, setLoggedIn] = useState(Boolean(saveUserData));

  const logIn = async (values) => {
    try {
      const res = await axios.post(routes.loginPath(), values);
      localStorage.setItem('userId', JSON.stringify(res.data));
      setLoggedIn(true);

      return null;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw error;
      }

      console.error('Authorization failed:', error);
      throw error;
    }
  };
  const registerUser = async (values) => {
    try {
      const res = await axios.post(routes.signUpPath(), values);
      localStorage.setItem('userId', JSON.stringify(res.data));
      setLoggedIn(true);

      return null;
    } catch (error) {
      if (error.response && error.response.status === 409) {
        throw error;
      }

      console.error('Conflict failed:', error);
      throw error;
    }
  };
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  const getAuthHeader = () => {
    const userId = JSON.parse(localStorage.getItem('userId'));

    if (userId && userId.token) {
      return { Authorization: `Bearer ${userId.token}` };
    }

    return {};
  };

  const authContextValue = useMemo(() => ({
    loggedIn,
    saveUserData,
    logIn,
    logOut,
    registerUser,
    getAuthHeader,
  }), [loggedIn, saveUserData]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);
export { AuthContext, useAuth };
export default AuthProvider;
