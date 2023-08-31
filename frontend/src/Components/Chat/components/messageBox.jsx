/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react"
import { InputGroup, Form, Button } from "react-bootstrap";
import { BsSend } from "react-icons/bs";
import { socket }  from "../../../contexts/ProvideAPI";
import { addPost, addPosts } from "../../../slices/messages";
import { useDispatch } from "react-redux";
import { selectorsMessage } from '../../../slices/messages';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import  AuthContext  from "../../../contexts/index"; // Подставьте правильный путь к контексту
import ChannelName from '../../common/ChannelName.jsx';
import { selectors } from '../../../slices/channels';




// eslint-disable-next-line react/prop-types
const MessageForm = ({ channelId}) => {
  const [message, setMessage] = useState('');
  const dispatch = useDispatch()
  const uniqueId = _.uniqueId();
  const { saveUserData } = useContext(AuthContext);

  const sendMessage = () => {
    if (message.trim() === '') {
      return;
    }
    const newMessage = {
      id: uniqueId,
      channelId,
      user: saveUserData.username,
      timestamp: new Date().toISOString(),
      message,
    };
    socket.emit('newMessage', newMessage, (acknowledgement) => {
      console.log('Сообщение отправлено:', acknowledgement);
    });
    setMessage('');
  };
  return (
    <InputGroup className="mb-3">
      <Form.Control
        placeholder="Введите сообщение..."
        aria-label="Recipient's username"
        aria-describedby="basic-addon2"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button variant="outline-secondary" id="button-addon2" onClick={sendMessage}>
        <BsSend />
      </Button>
    </InputGroup>
  );
};


const getMessageCountLabel = (count) => {
  switch (count) {
    case 0:
      return "нет сообщений";
    case 1:
      return `${count} сообщение`;
    case 2:
    case 3:
    case 4:
      return `${count} сообщения`;
    default:
      return `${count} сообщений`;
  }
};


const messagesBox = () => {
  const [message,setMessage] = useState('')
  const dispatch = useDispatch()
  const currentChannelId = useSelector(state => state.channels.currentChannelId)
  const messages = useSelector(selectorsMessage.selectAll);
  const summMessages = messages.filter(({channelId}) => channelId === currentChannelId).length
  const channels = useSelector(selectors.selectAll);




  
// useEffect(()=>{
//   socket.onMessage = (event) =>{
//     console.log('socet data', event.data)
//   };

// })

const sendMessage = (e) => {
  e.preventDefault(); // Предотвращаем перезагрузку страницы
  console.log('sending', message);
  // socket.connect
  socket.send(message);
  console.log('socket', socket)
  setMessage('');
};

useEffect(() => {
  socket.on('newMessage', (newMessage) => {
    //console.log('Сообщение с сервера:', newMessage); // Выводим полученное сообщение в консоль
    dispatch(addPost(newMessage));
  });
}, [])


    return (  <div className="col p-0 h-100">
    <div className="d-flex flex-column h-100">
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <p className="m-0"><b><ChannelName  name={channels.find(channel => channel.id === currentChannelId)?.name}/></b></p>
        <span className="text-muted">
          {getMessageCountLabel(summMessages)}
          </span>
      </div>

      <div id="messages-box" className="chat-messages overflow-auto px-5 ">
        <div className="text-break mb-2">
          {messages.filter(({channelId}) => channelId === currentChannelId).map(({user, message}, uniqueId) => {
            return(
            <div key = {uniqueId} className="text-break mb-2">
             <b>{user}</b>: {message}
            </div>
            )
            })}
        </div>
      </div>
      
      <div id="messages-box" className="chat-messages overflow-auto px-5"></div>
      <div className="mt-auto px-5 py-3">
      <form onSubmit={sendMessage}>
        <MessageForm channelId={currentChannelId}/>
        </form>
      </div>
    </div>
  </div>)
};

export default messagesBox;