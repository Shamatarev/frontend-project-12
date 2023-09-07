/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable functional/no-expression-statement */
/* eslint-disable functional/no-conditional-statement */
/* eslint-disable react/prop-types */

import React, { useState, useContext, useEffect } from 'react';
import { InputGroup, Form, Button } from 'react-bootstrap';
import { BsSend } from 'react-icons/bs';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import LeoProfanity from 'leo-profanity';
import AuthContext from '../../../contexts/index';
import { socket } from '../../../contexts/ProvideAPI';

const MessageForm = ({ channelId }) => {
  const [message, setMessage] = useState('');
  const { saveUserData } = useContext(AuthContext);
  const { t } = useTranslation();

  const sendMessage = () => {
    const uniqueId = _.uniqueId();
    if (message.trim() === '') {
      return;
    }
    const profanityFilter = LeoProfanity;
    profanityFilter.loadDictionary(['en', 'ru']);

    const censoredMessage = profanityFilter.clean(message);
    const newMessage = {
      id: uniqueId,
      channelId,
      user: saveUserData.username,
      timestamp: new Date().toISOString(),
      message: censoredMessage,
    };
    socket.emit('newMessage', newMessage);
    setMessage('');
  };

  const handleSendButtonClick = () => {
    sendMessage();
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // Предотвращаем перезагрузку страницы
        if (message.trim() !== '') {
          sendMessage();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [message]);

  return (
    <InputGroup className="mb-3">
      <Form.Control
        placeholder={t('messageFormPlaceholder')}
        aria-label="Новое сообщение"
        aria-describedby="basic-addon2"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button variant="outline-secondary" id="button-addon2" onClick={handleSendButtonClick}>
        <BsSend />
      </Button>
    </InputGroup>
  );
};

export default MessageForm;
