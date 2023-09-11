import React, { useContext } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { BsSend } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import LeoProfanity from 'leo-profanity';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { AuthContext } from '../../../contexts/AuthProvider';
import { useChatApi } from '../../../contexts/ChatAPIProvider';

const MessageForm = ({ channelId }) => {
  const { saveUserData } = useContext(AuthContext);
  const { t } = useTranslation();
  const { sendMessage: newSendMessage } = useChatApi();
  console.log(1111111, channelId);
  const validationSchema = Yup.object().shape({
    message: Yup.string().trim().required(),
  });

  const formik = useFormik({
    initialValues: { message: '' },

    onSubmit: async ({ message }, { resetForm, setSubmitting }) => {
      console.log('1. Начало обработки отправки формы');
      console.log('2. Значение поля "message":', message);
      try {
        const profanityFilter = LeoProfanity;
        profanityFilter.loadDictionary(['en', 'ru']);
        const censoredMessage = profanityFilter.clean(message);
        console.log('3. Текст после цензуры:', censoredMessage);
        const newMessage = {
          channelId,
          user: saveUserData.username,
          timestamp: new Date().toISOString(),
          message: censoredMessage,
        };
        console.log('4. Готово к отправке сообщения:', newMessage);
        await newSendMessage(newMessage);
        console.log('5. Сообщение успешно отправлено');
        setSubmitting(true);
        resetForm();
      } catch (error) {
        setSubmitting(false);
        toast.error(t('errors.netWorkError'));
        console.error(error.message);
      }
    },
    validationSchema,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <InputGroup className="mb-3">
        <Form.Control
          type="text"
          name="message"
          placeholder={t('messageFormPlaceholder')}
          aria-label="Новое сообщение"
          aria-describedby="basic-addon2"
          value={formik.values.message}
          onChange={formik.handleChange}
        />
        <Button
          variant="outline-secondary"
          id="button-addon2"
          type="submit"
          disabled={formik.isSubmitting || formik.values.message.length === 0}
        >
          <BsSend />
        </Button>
      </InputGroup>
    </form>

  );
};

export default MessageForm;
