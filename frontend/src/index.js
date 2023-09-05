import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './Components/App';
import { Provider } from 'react-redux';
import  store  from './slices/index'
import { socket } from './contexts/ProvideAPI'
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
const userLanguage = localStorage.getItem('userLanguage');
const DEFAULT_LANGUAGE = userLanguage ?? 'ru';
import resources from './locales/index.js';
import { ToastContainer } from 'react-toastify'; // Импортируйте ToastContainer
import { ErrorBoundary } from '@rollbar/react'; // Provider imports 'rollbar'

const Init = async () => {
        
  const rollbarConfig = {
    accessToken: '92acc085d13c49d4afe16eeeced71bb6',
    environment: 'testenv',
  };

  function TestError() {
    const a = null;
    return a.hello();
  }
  
        const i18n = i18next.createInstance();
        await i18n
          .use(initReactI18next)
          .init({
            resources,
            lng: DEFAULT_LANGUAGE,
            fallbackLng: ['en', 'ru'],
          });

          return (
            <I18nextProvider i18n={i18n}>
              <Provider store={store} socket={socket} config={rollbarConfig}>
                <ErrorBoundary>
                  <TestError />
                  <ToastContainer />
                  <App />
                </ErrorBoundary>
              </Provider>
            </I18nextProvider>
      );
    }


const app = async () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(await Init());
};

app();