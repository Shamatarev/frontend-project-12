/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import fetchData from './thunks';

const channelsAdapter = createEntityAdapter();
const initialState = channelsAdapter.getInitialState();

const channelsSlice = createSlice({
  name: 'channels',
  initialState,

  reducers: {
    addChannels: channelsAdapter.addMany,
    addChannel: channelsAdapter.addOne,
    updateChannelData(state, action) {
      const { id, name } = action.payload;
      channelsAdapter.updateOne(state, { id, changes: { name } });
    },
    removeChannel(state, action) {
      // console.log('action.payload', action.payload);
      channelsAdapter.removeOne(state, action.payload.id);
      state.currentChannelId = 1;
    },
    changeChannelId(state, action) {
      console.log('action.payload', action.payload);
      state.currentChannelId = action.payload;
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        const { channels } = action.payload;
        channelsAdapter.setAll(state, channels);
        state.currentChannelId = action.payload.currentChannelId;
        state.loadingStatus = 'idle';
        state.error = null;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error;
      });
  },
});

export const { updateChannelData } = channelsSlice.actions;
export const { addChannels } = channelsSlice.actions;
export const { addChannel } = channelsSlice.actions;
export const { removeChannel } = channelsSlice.actions;
export const { changeChannelId } = channelsSlice.actions;
export const selectors = channelsAdapter.getSelectors((state) => state.channels);
export const selectCurrentChannelId = (state) => state.channels.currentChannelId;
export default channelsSlice.reducer;
