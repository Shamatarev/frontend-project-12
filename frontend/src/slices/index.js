import { configureStore } from "@reduxjs/toolkit"
import messagesReduser  from "./messages"
import channelsReduser  from "./channels";
import modalReduser from "./modal";

const store = configureStore({
    reducer: {
        channels: channelsReduser,
        messages: messagesReduser,
        modal: modalReduser,
    },
});

export default store;