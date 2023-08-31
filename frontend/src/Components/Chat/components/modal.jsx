
/* eslint-disable react/prop-types */

import React, { useState, useEffect } from "react"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { socket }  from "../../../contexts/ProvideAPI";
import { useDispatch } from "react-redux";
import { addChannel } from "../../../slices/channels";
import { removeChannel } from "../../../slices/channels";
import { updateChannelData } from "../../../slices/channels";
import { useSelector } from 'react-redux';
import { changeChannelId } from "../../../slices/channels"; // Импортируйте действие из вашего среза
import { removeMessagesByChannelId } from '../../../slices/messages';


export function ChannelModalAdd() {
    const [show, setShow] = useState(false);
    const [channelName,setChannelName] = useState('')
    const [isInvalid, setIsInvalid] = useState(false); // Состояние для проверки уникальности

    const handleClose = () => {
        setShow(false);
        setChannelName('');
        setIsInvalid(false);
    };

    const handleShow = () => setShow(true);
    const dispatch = useDispatch()

    const addButtonStyle = {
    width: '25px',
    height: '25px',
    padding: '0',
    };
    
    const channels = useSelector((state) => state.channels);

      useEffect(() => {
        socket.on('newChannel', (newChannel) => {
          //console.log('Сообщение с сервера:', newMessage); // Выводим полученное сообщение в консоль
          dispatch(addChannel(newChannel));
          console.log('newChannel.id', newChannel)
          dispatch(changeChannelId(newChannel.id))
        });
      }, [])

      
      const sendChannel = () => {
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
          name: channelName, 
        };
        socket.emit('newChannel', newChannel, (acknowledgement) => {
          console.log('Сообщение отправлено:    const [show, setShow] = useState(false);', acknowledgement);

        });
        setIsInvalid(false); // Сбрасываем стили и разблокируем кнопку
        handleClose()
      };

        // Добавляем обработчик события onKeyDown
      const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          sendChannel(); // Вызываем функцию отправки данных
        }
      };


    return (
      <>
        <Button variant="primary" style={addButtonStyle} onClick={handleShow}>
          +
        </Button>
  
        <Modal 
        show={show}
        centered
        onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Добавить канал</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
                autoFocus
              >
                <Form.Label>Название канала</Form.Label>
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
            <div className="invalid-feedback">Должно быть уникальным</div> {/* Добавил блок div для сообщения */}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Отменить
            </Button>
            <Button variant="primary" onClick={sendChannel} disabled={isInvalid} >
              Отправить
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }


///__________________________________________________________________________________________________________

export function ChannelModalUpdate({ show, handleClose, id}) {
  const [isInvalid, setIsInvalid] = useState(false); // Состояние для проверки уникальности
  const [channelName,setChannelName] = useState('')
  const dispatch = useDispatch()

  const channels = useSelector((state) => state.channels);

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

      socket.emit('renameChannel', newChannel, (acknowledgement) => {
        console.log('Сообщение отправлено:    const [show, setShow] = useState(false);', acknowledgement);

      });
      setIsInvalid(false); // Сбрасываем стили и разблокируем кнопку
      handleClose()
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
          <Modal.Title>Добавить канал</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
              autoFocus
            >
              <Form.Label>Название канала</Form.Label>
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
          <div className="invalid-feedback">Должно быть уникальным</div> {/* Добавил блок div для сообщения */}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Отменить
          </Button>
          <Button variant="primary" onClick={upChannel} disabled={isInvalid} >
            Отправить
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}


///__________________________________________________________________________________________________________

  export function ChannelModalDel({ show, handleClose, isInvalid, id}) {

    const dispatch = useDispatch()


      useEffect(() => {
        socket.on('removeChannel', (id) => {
          console.log('Сообщение с сервера:', id); // Выводим id  в консоль 
          dispatch(removeChannel(id));
          //console.log('newChannel.id', channelID)
          dispatch(removeMessagesByChannelId(id));
        });
      }, [])


    const delChannel = () => {
      const channelID = {
        id, 
      };
      // отправляю событие на сервер для удаления канала по id
      socket.emit('removeChannel', channelID, (acknowledgement) => {
        console.log('Канал удален:', acknowledgement);
      });
       handleClose(); // Закройте модальное окно после удаления
    };



    return (
      <>
 
        <Modal 
        show={show}
        centered
        onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Удалить канал</Modal.Title>
            </Modal.Header>
              <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Отменить
                  </Button>
                  <Button variant="danger" onClick={delChannel} disabled={isInvalid}>
                    Удалить
                  </Button>
              </Modal.Footer>
        </Modal>
        
      </>
    );
  }





