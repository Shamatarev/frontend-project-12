import React from 'react';
import { Button, Dropdown, ButtonGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import cn from 'classnames';
import { actions as modalActions } from '../../../slices/modal.js';
import ChannelName from '../../common/ChannelName.jsx';
import '../../styles/channelButton.css';

const ChannelButton = ({
  channel, isActive, onClick, removable,
}) => {
  const { t } = useTranslation();
  const { name, id } = channel;
  const dispatch = useDispatch();

  const classNameMainButton = cn('w-100 rounded-0 text-start btn', 'containerbutton', {
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
    if (removable) {
      dispatch(modalActions.open({ type: 'remove', dataChannel }));
    }
  };

  const handleButtonUpdateClickChannel = () => {
    const dataChannel = {
      channelId: id,
      nameChannel: name,
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
