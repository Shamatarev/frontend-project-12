import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useFormik } from 'formik'; // Импортируйте useFormik
import { useChatApi } from '../../../contexts/ChatAPIProvider';
import 'react-toastify/dist/ReactToastify.css';

const ChannelModalDel = ({
  show, handleClose, id,
}) => {
  const { remChannel } = useChatApi();
  const { t } = useTranslation();
  const notify = () => toast(t('toasts.removeChannel'));

  const formik = useFormik({
    initialValues: {
    },

    onSubmit: async ({ setSubmitting }) => {
      const channelID = {
        id,
      };
      await remChannel(channelID);
      handleClose();
      notify();
      setSubmitting(false);
    },
  });

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
        {/* Добавьте форму с использованием Formik */}
        <form onSubmit={formik.handleSubmit}>
          <p className="col-6">{t('modals.submitRemove')}</p>
          <Button variant="secondary" onClick={handleClose}>
            {t('modals.cancelButton')}
          </Button>
          <Button variant="danger" type="submit" disabled={formik.isSubmitting}>
            {t('modals.removeButton')}
          </Button>
        </form>
      </Modal.Footer>
    </Modal>
  );
};

export default ChannelModalDel;
