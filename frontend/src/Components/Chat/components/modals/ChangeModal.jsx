import { useDispatch, useSelector } from 'react-redux';

import { Modal } from 'react-bootstrap';

import { selectors as modalSelectors, actions as modalActions } from '../../../../Slices/modal';
import ChannelModalAdd from './ModalСhannelAdd';
import ChannelModalUpdate from './ModalChannelUpdate';
import ChannelModalDel from './ModalChannelDel';

const modalOption = {
  add: ChannelModalAdd,
  rename: ChannelModalUpdate,
  remove: ChannelModalDel,
};

const ModalWindow = () => {
  const dispatch = useDispatch();
  const modalType = useSelector(modalSelectors.getModalType);
  const isOpened = useSelector(modalSelectors.isModalOpened);
  const handleClose = () => dispatch(modalActions.close());
  const CurrentModal = modalOption[modalType];
  // console.log(111111, modalType, isOpened, CurrentModal);
  return (
    <Modal show={isOpened} onHide={handleClose} centered>
      {CurrentModal && <CurrentModal handleClose={handleClose} show={isOpened} />}
    </Modal>
  );
};

export default ModalWindow;
