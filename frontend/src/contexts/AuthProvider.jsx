/* eslint-disable react/jsx-no-constructed-context-values */
import React, {
  useState, useEffect, createContext, useContext,
} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Импорт стилей Bootstrap
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

  const logIn = async (values) => {
    try {
      const res = await axios.post(routes.loginPath(), values);
      localStorage.setItem('userId', JSON.stringify(res.data));
      setLoggedIn(true);
      setAuthSuccess(true); // Устанавливаем флаг успешной авторизации
      setAuthCompleted(true);
    } catch (error) {
      console.error('Authorization failed:', error);
    }
  };
  const registerUser = async (values) => {
    try {
      const res = await axios.post(routes.signUpPath(), values);
      localStorage.setItem('userId', JSON.stringify(res.data));
      setLoggedIn(true);
      setAuthSuccess(true); // Устанавливаем флаг успешной авторизации
      setAuthCompleted(true);
    } catch (error) {
      console.error('Authorization failed:', error);
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
      return;
    }

    if (authSuccess) {
      window.location.href = '/'; // Перенаправляем на главную страницу после успешной авторизации
    } else if (!loggedIn) {
      window.location.href = '/login';
    }
  }, [authCompleted, loggedIn, authSuccess]);

  return (
    <AuthContext.Provider value={{
      loggedIn,
      saveUserData,
      logIn,
      logOut,
      registerUser,
      getAuthHeader,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);
export { AuthContext, useAuth };
export default AuthProvider;
