import { configureStore } from "@reduxjs/toolkit";
import alertSlice from "./alert-slice";
import authSlice from "./auth-slice";
import onlineUsersSlice from "./onlineUsers-slice";

const store = configureStore({
    reducer: {
        alert: alertSlice.reducer,
        auth: authSlice.reducer, 
        onlineUsers: onlineUsersSlice.reducer, 
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;