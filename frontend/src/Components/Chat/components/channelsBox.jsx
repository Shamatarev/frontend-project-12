import React from 'react';
import { Formik} from 'formik';
import { Form } from 'react-bootstrap';
import { selectors } from '../../../slices/channels';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { changeChannelId }  from '../../../slices/channels';
import { ChannelModalAdd }from './modalСhannelAdd'
import { useTranslation } from 'react-i18next';
import SimpleButton from './buttonSimpleChannel';
import DropButton from './buttonDropdownChannel';


const ChannelsBox = () => {
  const { t } = useTranslation();
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
                  <b>{t('channels')}</b>
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