import React, { useState } from 'react';
import { Button, Dropdown, ButtonGroup } from 'react-bootstrap';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import ChannelName from '../../common/ChannelName.jsx';
import ChannelModalDel from './modalChannelDel';
import ChannelModalUpdate from './modalChannelUpdate';

const DropButton = ({
  channel, isActive, name = channel.name, id = channel.id, onClick,
}) => {
  const { t } = useTranslation();

  const classNameMainButton = cn('w-100 rounded-0 text-start btn', {
    'btn-secondary': isActive,
  });
  const classNameDropdown = cn('border-0', {
    'btn-secondary': isActive,
  });
  const [showModal, setShowModal] = useState(false);
  // Добавляем состояние для определения действия модального окна
  const [modalAction, setModalAction] = useState(null);

  const handleButtonClickRemoveChannel = () => {
    setShowModal(true);
    // Устанавливаем действие "delete" при клике на кнопку удаления
    setModalAction('delete');
  };

  const handleButtonUpdateClickChannel = () => {
    setShowModal(true);
    // Устанавливаем действие "rename" при клике на кнопку переименования
    setModalAction('rename');
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Dropdown as={ButtonGroup} className="d-flex">

      <Button type="button" className={classNameMainButton} onClick={() => onClick(channel.id)}>
        <ChannelName name={name} />
      </Button>

      <Dropdown.Toggle split className={classNameDropdown} placeholder={t('channelControl')}>
        <span className="visually-hidden">{t('channelControl')}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={handleButtonClickRemoveChannel}>{t('remove')}</Dropdown.Item>
        <Dropdown.Item onClick={handleButtonUpdateClickChannel}>{t('rename')}</Dropdown.Item>
      </Dropdown.Menu>

      {/* Передаем состояние modalAction */}
      {modalAction === 'delete' && <ChannelModalDel show={showModal} id={id} handleClose={handleCloseModal} />}
      {modalAction === 'rename' && <ChannelModalUpdate show={showModal} id={id} handleClose={handleCloseModal} />}
    </Dropdown>
  );
};

export default DropButton;
