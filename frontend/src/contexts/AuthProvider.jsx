/* eslint-disable consistent-return */
import React, {
  useState, useEffect, createContext, useContext, useMemo,
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
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await axios.post(routes.loginPath(), values);
      localStorage.setItem('userId', JSON.stringify(res.data));
      setLoggedIn(true);
      setAuthSuccess(true); // Устанавливаем флаг успешной авторизации
      setAuthCompleted(true);
      return null; // Возвращаем null в случае успешной авторизации
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Если сервер вернул статус 401 (неудачная аутентификация)
        throw error; // Возвращаем ошибку
      }
      // Если произошла другая ошибка
      console.error('Authorization failed:', error);
      throw error; // Возвращаем ошибку
    }
  };
  const registerUser = async (values) => {
    try {
      const res = await axios.post(routes.signUpPath(), values);
      localStorage.setItem('userId', JSON.stringify(res.data));
      setLoggedIn(true);
      setAuthSuccess(true); // Устанавливаем флаг успешной авторизации
      setAuthCompleted(true);
      return null; // Возвращаем null в случае успешной авторизации
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // Если сервер вернул статус 401 (неудачная аутентификация)
        throw error; // Возвращаем ошибку
      }
      // Если произошла другая ошибка
      console.error('Conflict failed:', error);
      throw error; // Возвращаем ошибку
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
