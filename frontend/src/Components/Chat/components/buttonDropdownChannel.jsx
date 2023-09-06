
/* eslint-disable react/prop-types */

import React, {useState} from 'react';
import { Button, Dropdown, ButtonGroup } from 'react-bootstrap';
import cn from 'classnames';
import ChannelName from '../../common/ChannelName.jsx';
import  ChannelModalDel  from './modalChannelDel';
import ChannelModalUpdate  from './modalChannelUpdate';
import { useTranslation } from 'react-i18next';



const DropButton = ({ channel, isActive, name = channel.name, id = channel.id, onClick }) => {
  const { t } = useTranslation();

  const classNameMainButton = cn('w-100 rounded-0 text-start btn', {
    'btn-secondary': isActive,
  });
  const classNameDropdown = cn('border-0', {
    'btn-secondary': isActive,
  });
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null); // Добавляем состояние для определения действия модального окна

  const handleButtonClickRemoveChannel = () => {
    setShowModal(true);
    setModalAction('delete'); // Устанавливаем действие "delete" при клике на кнопку удаления
  };

  const handleButtonUpdateClickChannel = () => {
    setShowModal(true);
    setModalAction('rename'); // Устанавливаем действие "rename" при клике на кнопку переименования
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Dropdown as={ButtonGroup} className="d-flex">
      <span className="visually-hidden">Управление каналом</span>
      <Button type="button" className={classNameMainButton} onClick={() => onClick(channel.id)}>
        <ChannelName name={name} />
      </Button>

      <Dropdown.Toggle split className={classNameDropdown}>
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