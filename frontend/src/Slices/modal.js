/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = ({
  isOpened: false,
  type: null,
});

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    open: (state, { payload: { type } }) => {
      state.isOpened = true;
      state.type = type;
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
};

export { actions, selectors };
export default modalSlice.reducer;
