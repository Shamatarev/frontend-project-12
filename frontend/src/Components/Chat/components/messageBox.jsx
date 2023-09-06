import React, { useEffect, useState} from "react"
import { socket }  from "../../../contexts/ProvideAPI";
import { addPost } from "../../../slices/messages";
import { useDispatch } from "react-redux";
import { selectorsMessage } from '../../../slices/messages';
import { useSelector } from 'react-redux';
import ChannelName from '../../common/ChannelName.jsx';
import { selectors } from '../../../slices/channels';
import getMessageCountLabel from "./getMessageCountLabel";
import MessageForm from "./messge";

const messagesBox = () => {
  const [message,setMessage] = useState('')
  const dispatch = useDispatch()
  const currentChannelId = useSelector(state => state.channels.currentChannelId)
  const messages = useSelector(selectorsMessage.selectAll);
  const summMessages = messages.filter(({channelId}) => channelId === currentChannelId).length
  const channels = useSelector(selectors.selectAll);

  
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
    console.log('Сообщение с сервера:', newMessage); // Выводим полученное сообщение в консоль
    dispatch(addPost(newMessage));
  });
}, []);


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
             <b>{user}{': '}</b>: {message}
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