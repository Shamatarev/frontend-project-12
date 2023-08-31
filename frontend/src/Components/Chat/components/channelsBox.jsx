
/* eslint-disable react/prop-types */


import React, {useState} from 'react';

import { Formik} from 'formik';
import { Button, Form,  Dropdown, ButtonGroup } from 'react-bootstrap';
import { selectors } from '../../../slices/channels';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import ChannelName from '../../common/ChannelName.jsx';
import { useDispatch } from 'react-redux';
import { changeChannelId } from '../../../slices/channels';
import { ChannelModalAdd }from './modal'
import { ChannelModalDel } from './modal';
import { ChannelModalUpdate } from './modal';



const SimpleButton = ( { channel, isActive, name = channel.name,  onClick }  ) =>
{
  const classNameMainButton = cn('w-100 rounded-0 text-start btn', {'btn-secondary': isActive})

  return(
    <Button type="button" className={classNameMainButton} onClick={() => onClick(channel.id)}>
      <ChannelName name={name}/>
    </Button>
  )
}




const DropButton = ({ channel, isActive, name = channel.name, id = channel.id, onClick }) => {
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
      <Button type="button" className={classNameMainButton} onClick={() => onClick(channel.id)}>
        <ChannelName name={name} />
      </Button>

      <Dropdown.Toggle split className={classNameDropdown}>
        <span className="visually-hidden">{'Управление каналом'}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={handleButtonClickRemoveChannel}>{'Удалить'}</Dropdown.Item>
        <Dropdown.Item onClick={handleButtonUpdateClickChannel}>{'Переименовать'}</Dropdown.Item>
      </Dropdown.Menu>

      {/* Передаем состояние modalAction */}
      {modalAction === 'delete' && <ChannelModalDel show={showModal} id={id} handleClose={handleCloseModal} />}
      {modalAction === 'rename' && <ChannelModalUpdate show={showModal} id={id} handleClose={handleCloseModal} />}
    </Dropdown>
  );
};





const ChannelsBox = () => {
  const currentChannelId = useSelector(state => state.channels.currentChannelId)
  const channels = useSelector(selectors.selectAll);
  const dispatch = useDispatch();
 
  const handleButtonClick = (channelId) => {
    console.log('Clicked channel with ID:', channelId);
    dispatch(changeChannelId(channelId)); // Отправляем действие для обновления currentChannelId
  };

  
    return ( 
      
      <Formik>
        <Form className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
            <Form className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
                  <b>Каналы</b>
                  <ChannelModalAdd/>
              </Form>   

              <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">

                {channels.map((channel) => (
      
                    <li key={channel.id} className="nav-item w-100">
                        { channel.removable === true  
                        ?  <DropButton channel={channel} isActive={currentChannelId === channel.id} onClick={() => handleButtonClick(channel.id)}/> 
                        : <SimpleButton channel={channel} isActive={currentChannelId === channel.id} onClick={() => handleButtonClick(channel.id)}/>
                        }
                    </li>))}
                </ul>

        </Form>
      </Formik>
      

            );
};

export default ChannelsBox;