/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import LeoProfanity from 'leo-profanity';
import { selectorsMessage } from '../../../slices/messages';
import ChannelName from '../../common/ChannelName.jsx';
import { selectors } from '../../../slices/channels';
import MessageForm from './Message.jsx';

const messagesBox = () => {
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
  const messages = useSelector(selectorsMessage.selectAll);
  const summMessages = messages.filter(({ channelId }) => channelId === currentChannelId).length;
  const channels = useSelector(selectors.selectAll);
  const { t } = useTranslation();
  const profanityFilter = LeoProfanity;
  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0"><b><ChannelName name={channels.find((channel) => channel.id === currentChannelId)?.name} /></b></p>
          <span className="text-muted">
            {t('messages', { count: summMessages })}
          </span>
        </div>

        <div id="messages-box" className="chat-messages overflow-auto px-5 ">
          <div className="text-break mb-2">
            {messages.filter(({ channelId }) => channelId === currentChannelId)
              .map(({ user, message }) => (
                <div key={message.id} className="text-break mb-2">
                  <b>
                    {user}
                    {': '}
                  </b>
                  {profanityFilter.clean(message)}
                </div>
              ))}
          </div>
        </div>

        <div id="messages-box" className="chat-messages overflow-auto px-5" />
        <div className="mt-auto px-5 py-3">
          <MessageForm channelId={currentChannelId} />
        </div>
      </div>
    </div>
  );
};

export default messagesBox;
