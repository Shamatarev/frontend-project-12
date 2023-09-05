
/* eslint-disable react/prop-types */

import React, { useState, useEffect } from "react"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { socket }  from "../../../contexts/ProvideAPI";
import { useDispatch } from "react-redux";
import { updateChannelData } from "../../../slices/channels";
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


///__________________________________________________________________________________________________________

const ChannelModalUpdate = ({ show, handleClose, id}) =>  {
  const [isInvalid, setIsInvalid] = useState(false); // Состояние для проверки уникальности
  const [channelName,setChannelName] = useState('')
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const channels = useSelector((state) => state.channels);
  const notify = () => toast(t('toasts.renameChannel'));

    useEffect(() => {
      socket.on('renameChannel', (updChannel) => {
        //console.log('Сообщение с сервера:', newMessage); // Выводим полученное сообщение в консоль
        dispatch(updateChannelData(updChannel));

      });
    }, [])

    
    const upChannel = () => {
      if (channelName.trim() === '') {
        return;
      }


      const channelIds = Object.keys(channels.entities); // Получаем массив id каналов из объекта entities
      const isDuplicate = channelIds.some((id) => {
        const channel = channels.entities[id];
        return channel.name === channelName;
      });

      if (isDuplicate) {
        setIsInvalid(true);
        return;
      }

      const newChannel = {
        id,
        name: channelName, 
      };
      <Modal.Title>{t('modals.addChannel')}</Modal.Title>
      socket.emit('renameChannel', newChannel, (acknowledgement) => {
        console.log('Сообщение отправлено:    const [show, setShow] = useState(false);', acknowledgement);

      });
      setIsInvalid(false); // Сбрасываем стили и разблокируем кнопку
      handleClose();
      notify();
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        upChannel(); // Вызываем функцию отправки данных
      }
    };
    
  return (
    <>
      <Modal 
      show={show}
      centered
      onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('modals.renameChannel')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
              autoFocus
            >
              <Form.Control 
              as="textarea" 
              rows={1}         
              value={channelName}
              onChange={(e) => {
                  setChannelName(e.target.value);
                  setIsInvalid(false); // Сбрасываем стили при изменении поля ввода
              }}
              isInvalid={isInvalid} // Применяем стили по условию
              onKeyDown={handleKeyDown} // Добавляем обработчик события
          />
          <div className="invalid-feedback">{t('modals.duplicate')}</div> {/* Добавил блок div для сообщения */}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
          {t('modals.cancelButton')}
          </Button>
          <Button variant="primary" onClick={upChannel} disabled={isInvalid} >
          {t('modals.sendButton')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChannelModalUpdate;