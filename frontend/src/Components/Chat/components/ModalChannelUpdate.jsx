/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { updateChannelData } from '../../../Slices/channels';
import socket from '../../../contexts/ProvideAPI';
import 'react-toastify/dist/ReactToastify.css';

const ChannelModalUpdate = ({ show, handleClose, id }) => {
  const [isInvalid, setIsInvalid] = useState(false); // Состояние для проверки уникальности
  const [channelName, setChannelName] = useState('');
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const channels = useSelector((state) => state.channels);
  const notify = () => toast(t('toasts.renameChannel'));

  useEffect(() => {
    socket.on('renameChannel', (updChannel) => {
      dispatch(updateChannelData(updChannel));
    });
  }, [dispatch]);

  const upChannel = () => {
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
      id,
      name: channelName,
    };
      <Modal.Title>{t('modals.addChannel')}</Modal.Title>;
      socket.emit('renameChannel', newChannel);
      setIsInvalid(false); // Сбрасываем стили и разблокируем кнопку
      handleClose();
      notify();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      upChannel(); // Вызываем функцию отправки данных
    }
  };

  return (
    <Modal
      show={show}
      centered
      onHide={handleClose}
    >
      <Modal.Body>
        <Modal.Header closeButton>
          <Modal.Title>{t('modals.renameChannel')}</Modal.Title>
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
              <Button variant="primary" onClick={upChannel} disabled={isInvalid}>
                {t('modals.sendButton')}
              </Button>
            </Modal.Footer>
          </Form.Group>
        </Form>
      </Modal.Body>

    </Modal>
  );
};

export default ChannelModalUpdate;
