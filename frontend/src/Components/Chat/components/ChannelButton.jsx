import React from 'react';
import { Button, Dropdown, ButtonGroup } from 'react-bootstrap';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ChannelName from '../../common/ChannelName.jsx';
import ChannelModalDel from './ModalChannelDel.jsx';
import ChannelModalUpdate from './ModalChannelUpdate.jsx';
import { actions as modalActions, selectors as modalSelectors } from '../../../Slices/modal.js';

const ChannelButton = ({
  channel, isActive, onClick, removable,
}) => {
  const { t } = useTranslation();
  const { name, id } = channel;
  const dispatch = useDispatch();
  const isOpened = useSelector(modalSelectors.isModalOpened);
  const modalType = useSelector(modalSelectors.getModalType);

  const classNameMainButton = cn('w-100 rounded-0 text-start btn', {
    'btn-primary': isActive,
    'btn-light': !isActive, // Добавляем класс btn-light для неактивных кнопок
  });

  const classNameDropdown = cn('border-0 rounded-0', {
    'btn-primary': isActive,
    'btn-light': !isActive, // Добавляем класс btn-light для неактивных кнопок
  });

  const handleButtonClickRemoveChannel = () => {
    if (removable) {
      console.log('Delete button clicked');
      dispatch(modalActions.open({ type: 'delete' }));
    }
  };

  const handleButtonUpdateClickChannel = () => {
    if (removable) {
      console.log('Rename button clicked');
      dispatch(modalActions.open({ type: 'rename' }));
    }
  };

  const handleCloseModal = () => {
    dispatch(modalActions.close());
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
            <Dropdown.Item onClick={handleButtonClickRemoveChannel}>{t('remove')}</Dropdown.Item>
            <Dropdown.Item onClick={handleButtonUpdateClickChannel}>{t('rename')}</Dropdown.Item>
          </Dropdown.Menu>
        </div>
      )}

      {isOpened && modalType === 'delete' && (
        <ChannelModalDel show={isOpened} id={id} handleClose={handleCloseModal} />
      )}

      {isOpened && modalType === 'rename' && (
        <ChannelModalUpdate show={isOpened} id={id} handleClose={handleCloseModal} />
      )}
    </Dropdown>
  );
};

export default ChannelButton;
