import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import socket from '../../../contexts/ProvideAPI';
import 'react-toastify/dist/ReactToastify.css';

const ChannelModalDel = ({
  show, handleClose, isInvalid, id,
}) => {
  const { t } = useTranslation();
  const notify = () => toast(t('toasts.removeChannel'));

  const delChannel = () => {
    const channelID = {
      id,
    };
    // отправляю событие на сервер для удаления канала по id
    socket.emit('removeChannel', channelID);
    handleClose(); // Закройте модальное окно после удаления
    notify();
  };

  return (
    <Modal
      show={show}
      centered
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.removeChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <p className="col-6">{t('modals.submitRemove')}</p>
        <Button variant="secondary" onClick={handleClose}>
          {t('modals.cancelButton')}
        </Button>
        <Button variant="danger" onClick={delChannel} disabled={isInvalid}>
          {t('modals.removeButton')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChannelModalDel;
