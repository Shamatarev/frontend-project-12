import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { useChatApi } from '../../../../contexts/ChatAPIProvider';
import { selectors as modalSelectors } from '../../../../Slices/modal.js';

const ChannelModalDel = ({ handleClose }) => {
  const { t } = useTranslation();
  const { remChannel } = useChatApi();
  const dataChannel = useSelector(modalSelectors.getModalData);
  const notify = () => toast(t('toasts.removeChannel'));

  const delChannel = () => {
    const channelID = {
      id: dataChannel.channelId,
    };
    remChannel(channelID);
    handleClose();
    notify();
  };

  return (

    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.removeChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <p className="col-6">{t('modals.submitRemove')}</p>
        <Button variant="secondary" onClick={handleClose}>
          {t('modals.cancelButton')}
        </Button>
        <Button variant="danger" onClick={delChannel}>
          {t('modals.removeButton')}
        </Button>
      </Modal.Footer>

    </>

  );
};

export default ChannelModalDel;
