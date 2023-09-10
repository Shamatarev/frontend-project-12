/* eslint-disable no-shadow */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
// eslint-disable-next-line no-unused-vars
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useChatApi } from '../../../contexts/ChatAPIProvider';
import 'react-toastify/dist/ReactToastify.css';

const ChannelModalUpdate = ({ show, handleClose, id }) => {
  const [isInvalid, setIsInvalid] = useState(false); // Состояние для проверки уникальности
  const [channelName, setChannelName] = useState('');
  // const dispatch = useDispatch();
  const { t } = useTranslation();
  const channels = useSelector((state) => state.channels);
  const notify = () => toast(t('toasts.renameChannel'));
  const { renChannel } = useChatApi();

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
    renChannel(newChannel);
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
            autoFocus
          >

            <Form.Control
              id="name"
              name="name"
              value={channelName}
              className="mb-2 form-control"
              onChange={(e) => {
                setChannelName(e.target.value);
                setIsInvalid(false); // Сбрасываем стили при изменении поля ввода
              }}
              isInvalid={isInvalid} // Применяем стили по условию
              onKeyDown={handleKeyDown}
            />
            <Form.Label visuallyHidden for="name">{t('modals.channelName')}</Form.Label>
            <div className="invalid-feedback">{t('modals.duplicate')}</div>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleClose}>
                {t('modals.cancelButton')}
              </Button>
              <Button variant="primary" onClick={upChannel} disabled={isInvalid}>
                {t('modals.sendButton')}
              </Button>

            </div>

          </Form.Group>
        </Form>
      </Modal.Body>

    </Modal>
  );
};

export default ChannelModalUpdate;
