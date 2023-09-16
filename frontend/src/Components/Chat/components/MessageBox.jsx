import React, { useContext, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import LeoProfanity from 'leo-profanity';
import { selectorsMessage } from '../../../slices/messages';
import { selectors } from '../../../slices/channels';
import ChannelName from '../../common/ChannelName.jsx';
import MessageForm from './Message.jsx';
import { AuthContext } from '../../../contexts/AuthProvider';
import '../../styles/message.css';

const MessagesBox = () => {
  const { saveUserData } = useContext(AuthContext);
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
  const messages = useSelector(selectorsMessage.selectAll);
  const summMessages = messages.filter(({ channelId }) => channelId === currentChannelId).length;
  const channels = useSelector(selectors.selectAll);
  const { t } = useTranslation();
  const profanityFilter = LeoProfanity;
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, currentChannelId]);

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b>
              <ChannelName name={channels
                .find((channel) => channel.id === currentChannelId)?.name}
              />
            </b>
          </p>
          <span className="text-muted">
            {t('message.messages', { count: summMessages })}
          </span>
        </div>

        <div id="messages-box" className="chat-messages overflow-auto px-5 ">
          <div className="text-break mb-2">
            {messages.filter(({ channelId }) => channelId === currentChannelId)
              .map(({ user, message }, index) => (
                <div
                  key={message.id}
                  className={`text-break mb-2 ${user === saveUserData.username ? 'text-end' : 'text-start'}`}
                >
                  <b>
                    {user}
                    {': '}
                  </b>
                  {profanityFilter.clean(message)}
                  {index === messages.length - 1 && <div ref={messagesEndRef} />}
                </div>
              ))}
          </div>
        </div>

        <div className="mt-auto px-5 py-3">
          <MessageForm channelId={currentChannelId} />
        </div>
      </div>
    </div>
  );
};

export default MessagesBox;
