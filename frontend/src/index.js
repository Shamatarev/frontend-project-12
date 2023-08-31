import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './Components/App';
import { Provider } from 'react-redux';
import  store  from './slices/index'
import { socket } from './contexts/ProvideAPI'

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Provider store={store} socket={socket}>
      <App />
    </Provider>
);

