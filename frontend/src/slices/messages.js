import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    messages: []
}

const messagesSlice = createSlice({
    name: 'messages_slice',
    initialState,
    reducers: {
        addMessages (state, action) {
            state.messages = action.payload
        },
    },
});

export const { addMessages } = messagesSlice.actions;
export default messagesSlice.reducer;