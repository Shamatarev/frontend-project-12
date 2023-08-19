import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    channels: []
}

const channelsSlice = createSlice({
    name: 'channels_slice',
    initialState,
    reducers: {
        addChannels(state, action) {
            state.channels = action.payload
        }
    }
})

export const { addChannels } = channelsSlice.actions;
export default channelsSlice;