import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from 'formik';
import leoProfanity from 'leo-profanity';
import { useChatApi } from '../../../../contexts/ChatAPIProvider'; // Замените на правильный путь к вашему контексту
import { selectors as modalSelectors } from '../../../../slices/modal.js';

const ChannelModalUpdate = ({ handleClose }) => {
  const { renChannel } = useChatApi();
  const { t } = useTranslation();
  const channels = useSelector((state) => state.channels);
  const channelNames = Object.values(channels.entities).map((channel) => channel.name);
  const dataChannel = useSelector(modalSelectors.getModalData);
  const notify = () => toast(t('toasts.renameChannel'));

  const validationSchema = Yup.object().shape({
    channelName: Yup.string()
      .trim()
      .required('Имя канала обязательно для заполнения')
      .notOneOf(channelNames, t('modals.duplicate')),
  });

  const formik = useFormik({
    initialValues: {
      channelName: '',
    },

    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const censoredChannel = leoProfanity.clean(values.channelName);
        const newChannel = {
          id: dataChannel.channelId,
          name: censoredChannel,
        };
        console.log(newChannel);
        await renChannel(newChannel);
        setSubmitting(true);
        resetForm();
        notify();
        handleClose(); // Закрыть модальное окно после отправки
      } catch (error) {
        toast.error(t('errors.netWorkError'));
        // console.error(error.channel);
        setSubmitting(false);
      }
    },
    validationSchema,
  });

  const handleFormSubmit = (e) => {
    e.preventDefault(); // Предотвращаем действие по умолчанию для Enter
    formik.handleSubmit();
  };
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.renameChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        <Form onSubmit={handleFormSubmit}>
          <Form.Group
            className="mb-3"
            autoFocus
          >

            <Form.Control
              id="channelName"
              name="channelName"
              type="text"
              placeholder={t('modals.channelName')}
              className="mb-2"
              value={formik.values.channelName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.channelName && formik.errors.channelName}
            />
            <Form.Label visuallyHidden htmlFor="channelName">
              {t('modals.channelName')}
            </Form.Label>
            {formik.touched.channelName && formik.errors.channelName && (
            <div className="invalid-feedback">{formik.errors.channelName}</div>
            )}
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                {t('modals.cancelButton')}
              </Button>
              <Button variant="primary" onClick={handleFormSubmit} disabled={!formik.isValid}>
                {t('modals.sendButton')}
              </Button>
            </Modal.Footer>
          </Form.Group>
        </Form>
      </Modal.Body>
    </>
  );
};

export default ChannelModalUpdate;
