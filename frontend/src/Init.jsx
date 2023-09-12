import React from 'react';
import './index.css';
import { Provider } from 'react-redux';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { ToastContainer } from 'react-toastify'; // Импортируйте ToastContainer
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { io } from 'socket.io-client';
import LeoProfanity from 'leo-profanity';
import ChatApiProvider from './contexts/ChatAPIProvider';
import resources from './locales/index.js';
import store from './Slices/index';
import App from './Components/App';

const userLanguage = localStorage.getItem('userLanguage');
const DEFAULT_LANGUAGE = userLanguage ?? 'ru'; // Provider imports 'rollbar'

const Init = async () => {
  const rollbarConfig = {
    accessToken: process.env.REACT_APP_ROLLBAR_ACCESS_TOKEN,
    enabled: process.env.NODE_ENV === 'production',
    captureUncaught: true,
    captureUnhandledRejections: true,
    environment: 'production',
  };

  const i18n = i18next.createInstance();
  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: DEFAULT_LANGUAGE,
      fallbackLng: ['en', 'ru'],
    });

  const profanityFilter = LeoProfanity;

  profanityFilter.add(profanityFilter.getDictionary('ru'));
  profanityFilter.add(profanityFilter.getDictionary('en'));

  const URL = '/';
  const socket = io(URL, { autoConnect: true });

  return (
    <RollbarProvider config={rollbarConfig}>
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <ChatApiProvider socket={socket}>
            <ErrorBoundary>
              <ToastContainer />
              <App />
            </ErrorBoundary>
          </ChatApiProvider>
        </Provider>
      </I18nextProvider>
    </RollbarProvider>
  );
};

export default Init;
