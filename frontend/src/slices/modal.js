/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = ({
  isOpened: false,
  type: null,
  data: {},
});

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    open: (state, { payload: { type, dataChannel } }) => {
      state.isOpened = true;
      state.type = type;
      state.data = dataChannel;
    },
    close: (state) => {
      state.isOpened = false;
    },
  },
});

const { actions } = modalSlice;
const selectors = {
  getModalType: (state) => state.modal.type,
  isModalOpened: (state) => state.modal.isOpened,
  getModalData: (state) => state.modal.data,
};

export { actions, selectors };
export default modalSlice.reducer;
