/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-duplicates */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
// eslint-disable-next-line no-unused-vars
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import socket from '../../../contexts/ProvideAPI';

import { AuthContext } from '../../../contexts/AuthProvider'; // Замените на правильный путь к вашему контексту
import 'react-toastify/dist/ReactToastify.css';

export const ChannelModalAdd = () => {
  const [show, setShow] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [isInvalid, setIsInvalid] = useState(false); // Состояние для проверки уникальности
  const { saveUserData } = useContext(AuthContext);
  const { t } = useTranslation();

  const handleClose = () => {
    setShow(false);
    setChannelName('');
    setIsInvalid(false);
  };

  const handleShow = () => setShow(true);

  const addButtonStyle = {
    width: '25px',
    height: '25px',
    padding: '0',
  };

  const channels = useSelector((state) => state.channels);

  const sendChannel = () => {
    const notify = () => toast(t('toasts.createChannel'));
    if (channelName.trim() === '') {
      return;
    }
    // Получаем массив id каналов из объекта entities
    const channelIds = Object.keys(channels.entities);
    const isDuplicate = channelIds.some((id) => {
      const channel = channels.entities[id];
      return channel.name === channelName;
    });

    if (isDuplicate) {
      setIsInvalid(true);
      return;
    }

    const newChannel = {
      name: channelName,
      user: saveUserData.username,
    };
    socket.emit('newChannel', newChannel);
    setIsInvalid(false); // Сбрасываем стили и разблокируем кнопку
    handleClose();
    notify();
  };

  // Добавляем обработчик события onKeyDown
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendChannel(); // Вызываем функцию отправки данных
    }
  };

  return (
    <>
      <Button variant="primary" style={addButtonStyle} onClick={handleShow}>
        +
      </Button>

      <Modal
        show={show}
        centered
        onHide={handleClose}
      >

        <Modal.Body>
          <Modal.Header closeButton>
            <Modal.Title>{t('modals.addChannel')}</Modal.Title>
          </Modal.Header>
          <Form>
            <Form.Group
              className="mb-3"
              autoFocus
            >
              <Modal.Footer>
                <Form.Label visuallyHidden for="name">{t('modals.channelName')}</Form.Label>
                <Form.Control
                  id="name"
                  name="name"
                  type="text"
                  placeholder={t('modals.channelName')}
                  className="mb-2"
                  value={channelName}
                  onChange={(e) => {
                    setChannelName(e.target.value);
                    setIsInvalid(false); // Сбрасываем стили при изменении поля ввода
                  }}
                  isInvalid={isInvalid} // Применяем стили по условию
                  onKeyDown={handleKeyDown}
                />
                <div className="invalid-feedback">{t('modals.duplicate')}</div>
                {' '}
                {/* Добавил блок div для сообщения */}
                <Button variant="secondary" onClick={handleClose}>
                  {t('modals.cancelButton')}
                </Button>
                <Button variant="primary" onClick={sendChannel} disabled={isInvalid}>
                  {t('modals.sendButton')}
                </Button>
              </Modal.Footer>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
