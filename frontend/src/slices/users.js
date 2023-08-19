/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: 'Anton',
    age: 35
}

const usersSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        increment_age(state, action) {
            state.age += 1
        },
    },
});

export const { increment_age } = usersSlice.actions

export default usersSlice.reducer;