import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
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

  const handleFormSubmit = (e) => {
    e.preventDefault(); // Предотвращаем действие по умолчанию для Enter
    formik.handleSubmit();
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
      <Form onSubmit={handleFormSubmit}>

        <Modal.Footer>
          <p className="col-6">{t('modals.submitRemove')}</p>
          <Button variant="secondary" onClick={handleClose}>
            {t('modals.cancelButton')}
          </Button>
          <Button variant="danger" type="submit">
            {t('modals.removeButton')}
          </Button>
        </Modal.Footer>

      </Form>
    </Modal>
  );
};

export default ChannelModalDel;
