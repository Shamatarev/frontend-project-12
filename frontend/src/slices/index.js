import { configureStore } from "@reduxjs/toolkit"
import { userReducer } from "./users";
import { messagesReduser } from "./messages"
import { channelsReduser } from "./channels";

const store = configureStore({
    reducer: {
        user: userReducer,
        channels: channelsReduser,
        messages: messagesReduser,
    },
});

export default store;