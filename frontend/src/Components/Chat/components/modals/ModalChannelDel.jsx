import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useChatApi } from '../../../../contexts/ChatAPIProvider';
import { selectors as modalSelectors } from '../../../../slices/modal.js';
import 'react-toastify/dist/ReactToastify.css';

const ChannelModalDel = ({ handleClose }) => {
  const { t } = useTranslation();
  const { removeChannel } = useChatApi();
  const dataChannel = useSelector(modalSelectors.getModalData);
  const notify = () => toast(t('toasts.removeChannel'));

  const deleteChannel = async () => {
    try {
      const channelID = {
        id: dataChannel.channelId,
      };
      await removeChannel(channelID);
      handleClose();
      notify();
    } catch (error) {
      toast.error(t('errors.netWorkError'));
      // console.error(error);
    }
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
        <Button variant="danger" onClick={deleteChannel}>
          {t('modals.removeButton')}
        </Button>
      </Modal.Footer>
    </>
  );
};

export default ChannelModalDel;
