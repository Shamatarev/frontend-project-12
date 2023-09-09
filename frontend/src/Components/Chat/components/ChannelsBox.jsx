import React from 'react';
import { Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectors, changeChannelId, selectCurrentChannelId } from '../../../Slices/channels';
import { ChannelModalAdd } from './ModalСhannelAdd.jsx';
import ChannelButton from './ChannelButton.jsx';

const ChannelsBox = () => {
  const { t } = useTranslation();
  const channels = useSelector(selectors.selectAll);
  const currentChannelId = useSelector(selectCurrentChannelId);
  const dispatch = useDispatch();

  const handleButtonClick = (channelId) => {
    dispatch(changeChannelId(channelId));
  };

  return (
    <Form className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
      <Form className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>{t('channels')}</b>
        <ChannelModalAdd />
      </Form>

      <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
        {channels.map((channel) => (
          <li key={channel.id} className="nav-item w-100">
            <ChannelButton
              channel={channel}
              removable={channel.removable}
              isActive={currentChannelId === channel.id}
              onClick={() => handleButtonClick(channel.id)}
            />
          </li>
        ))}
      </ul>
    </Form>
  );
};

export default ChannelsBox;
