import React, { useRef, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import leoProfanity from 'leo-profanity';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useChatApi } from '../../../../contexts/ChatAPIProvider';
import { selectors as modalSelectors } from '../../../../slices/modal.js';
import 'react-toastify/dist/ReactToastify.css';

const ChannelModalUpdate = ({ handleClose }) => {
  const { renameChannel } = useChatApi();
  const { t } = useTranslation();
  const channels = useSelector((state) => state.channels);
  const channelNames = Object.values(channels.entities).map((channel) => channel.name);
  const dataChannel = useSelector(modalSelectors.getModalData);
  const notify = () => toast(t('toasts.renameChannel'));
  const input = useRef(null);

  const validationSchema = Yup.object().shape({
    channelName: Yup.string()
      .trim()
      .required('Имя канала обязательно для заполнения')
      .notOneOf(channelNames, t('modals.duplicate')),
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (dataChannel.nameChannel) {
        input.current.value = dataChannel.nameChannel;
        input.current.select();
        input.current.focus();
      }
    }, 1);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [dataChannel]);

  const formik = useFormik({
    initialValues: {
      channelName: '',
    },

    onSubmit: async (values, { setSubmitting }) => {
      try {
        const censoredChannel = leoProfanity.clean(values.channelName);
        const newChannel = {
          id: dataChannel.channelId,
          name: censoredChannel,
        };
        await renameChannel(newChannel);
        setSubmitting(false);
        notify();
        handleClose();
      } catch (error) {
        toast.error(t('errors.netWorkError'));
        // console.error(error.channel);
        setSubmitting(false);
      }
    },
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
  });

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.renameChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group
            className="mb-3"
            autoFocus
          >
            <Form.Control
              ref={input}
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
              <Button variant="primary" onClick={formik.handleSubmit} disabled={!formik.isValid}>
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
