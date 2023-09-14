/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import fetchData from './thunks';
import { removeChannel } from './channels';

const messagesAdapter = createEntityAdapter();
const initialState = messagesAdapter.getInitialState();

const messagesSlice = createSlice({
  name: 'messages_slice',
  initialState,
  reducers: {
    addPosts: messagesAdapter.addMany,
    addPost: messagesAdapter.addOne,
  },

  extraReducers: (builder) => {
    builder
      .addCase(removeChannel, (state, action) => {
        const channelId = action.payload;
        const messageIdsToRemove = Object.keys(state.entities)
          .filter((id) => state.entities[id].channelId === channelId.id);
        messagesAdapter.removeMany(state, messageIdsToRemove);
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        const { messages } = action.payload;
        messagesAdapter.setAll(state, messages);
        state.loadingStatus = 'idle';
        state.error = null;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error;
      });
  },
});

export const { addPosts, addPost, removeMessagesByChannelId } = messagesSlice.actions;
export const selectorsMessage = messagesAdapter.getSelectors((state) => state.messages);
export default messagesSlice.reducer;
