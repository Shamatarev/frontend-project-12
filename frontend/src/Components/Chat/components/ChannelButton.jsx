/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Button, Dropdown, ButtonGroup } from 'react-bootstrap';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ChannelName from '../../common/ChannelName.jsx';
import { actions as modalActions } from '../../../slices/modal.js';

const ChannelButton = ({
  channel, isActive, onClick, removable,
}) => {
  const { t } = useTranslation();
  const { name, id } = channel;
  const dispatch = useDispatch();

  const classNameMainButton = cn('w-100 rounded-0 text-start btn', {
    'btn-primary': isActive,
    'btn-light': !isActive,
  });

  const classNameDropdown = cn('border-0 rounded-0', {
    'btn-primary': isActive,
    'btn-light': !isActive,
  });

  const handleButtonClickRemoveChannel = () => {
    const dataChannel = {
      channelId: id,
    };
    console.log('11111', dataChannel);
    if (removable) {
      console.log('Delete button clicked');
      console.log('removable', removable);
      dispatch(modalActions.open({ type: 'remove', dataChannel }));
    }
  };

  const handleButtonUpdateClickChannel = () => {
    const dataChannel = {
      channelId: id,
      channelName: name,
    };
    if (removable) {
      dispatch(modalActions.open({ type: 'rename', dataChannel }));
    }
  };

  return (
    <Dropdown as={ButtonGroup} className="d-flex">
      <Button type="button" className={classNameMainButton} onClick={() => onClick(channel.id)}>
        <ChannelName name={name} />
      </Button>
      {removable && (
        <div className="d-flex">
          <Dropdown.Toggle split placeholder={t('channelControl')} className={classNameDropdown}>
            <span className="visually-hidden">{t('channelControl')}</span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={handleButtonClickRemoveChannel}
            >
              {t('remove')}
            </Dropdown.Item>
            <Dropdown.Item
              onClick={handleButtonUpdateClickChannel}
            >
              {t('rename')}
            </Dropdown.Item>
          </Dropdown.Menu>
        </div>
      )}
    </Dropdown>
  );
};

export default ChannelButton;
