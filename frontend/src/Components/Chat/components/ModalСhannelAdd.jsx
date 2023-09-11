import React, { useContext, useState } from 'react';
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
import { AuthContext } from '../../../contexts/AuthProvider'; // Замените на правильный путь к вашему контексту
import { useChatApi } from '../../../contexts/ChatAPIProvider'; // Замените на правильный путь к вашему контексту
import '../../Styles/styles.css'; // Импортируйте файл стилей

const ChannelModalAdd = () => {
  const { newChannelAdd } = useChatApi();
  const [show, setShow] = useState(false);
  const { saveUserData } = useContext(AuthContext);
  const { t } = useTranslation();

  const handleShow = () => setShow(true);
  const notify = () => toast(t('toasts.createChannel'));
  // Убедитесь, что у вас есть объект channels с entities и ids
  const channels = useSelector((state) => state.channels);

  const validationSchema = Yup.object().shape({
    channelName: Yup.string()
      .trim()
      .required('Имя канала обязательно для заполнения')
      .test('unique-channel-name', 'Имя канала должно быть уникальным', (name) => {
        const channelIds = Object.keys(channels.entities);
        const isDuplicate = channelIds.some((id) => {
          const channel = channels.entities[id];
          return channel.name === name;
        });
        return !isDuplicate;
      }),
  });

  const formik = useFormik({
    initialValues: {
      channelName: '', // Изменено с name на channelName
    },

    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const censoredChannel = leoProfanity.clean(values.channelName);
        const newChannel = {
          name: censoredChannel,
          user: saveUserData.username,
        };
        await newChannelAdd(newChannel);
        setSubmitting(true);
        resetForm();
        notify();
        formik.resetForm();
        setShow(false);
      } catch (error) {
        setSubmitting(false);
        toast.error(t('errors.netWorkError'));
        console.error(error.channel);
      }
    },
    validationSchema,
  });

  const sendChannel = () => {
    formik.handleSubmit();
  };

  const handleClose = () => {
    formik.resetForm();
    setShow(false);
  };
  return (
    <>
      <Button variant="primary" className="add-button" onClick={handleShow}>
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
                {t('modals.createChannel')}
              </Form.Label>
              {formik.touched.channelName && formik.errors.channelName && (
                <div className="invalid-feedback">{formik.errors.channelName}</div>
              )}
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  {t('modals.cancelButton')}
                </Button>
                <Button variant="primary" onClick={sendChannel} disabled={!formik.isValid}>
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

export default ChannelModalAdd;
