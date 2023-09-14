import React, { useContext } from 'react';
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
import { AuthContext } from '../../../../contexts/AuthProvider';
import { useChatApi } from '../../../../contexts/ChatAPIProvider';
import '../../../styles/styles.css';

const ChannelModalAdd = ({ handleClose }) => {
  const { newChannelAdd } = useChatApi();
  const { saveUserData } = useContext(AuthContext);
  const { t } = useTranslation();

  const notify = () => toast(t('toasts.createChannel'));

  const channels = useSelector((state) => state.channels);
  const channelNames = Object.values(channels.entities).map((channel) => channel.name);

  const validationSchema = Yup.object().shape({
    channelName: Yup.string()
      .trim()
      .required(t('required'))
      .notOneOf(channelNames, t('modals.duplicate')),
  });

  const formik = useFormik({
    initialValues: {
      channelName: '', // Изменено с name на channelName
    },

    onSubmit: async (values, { setSubmitting }) => {
      try {
        const censoredChannel = leoProfanity.clean(values.channelName);
        const newChannel = {
          name: censoredChannel,
          user: saveUserData.username,
        };
        await newChannelAdd(newChannel);
        setSubmitting(false);
        handleClose();
        notify();
      } catch (error) {
        toast.error(t('errors.netWorkError'));
        // console.error(error.channel);
        setSubmitting(false);
      }
    },
    validationSchema,
  });

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.addChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3" autoFocus>
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
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              {t('modals.cancelButton')}
            </Button>
            <Button variant="primary" type="submit" disabled={!formik.isValid}>
              {t('modals.sendButton')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </>
  );
};

export default ChannelModalAdd;
