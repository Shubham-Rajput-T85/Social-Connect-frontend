// store/onlineUsers-slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OnlineUsersState {
  users: string[];
}

const initialState: OnlineUsersState = {
  users: [],
};

const onlineUsersSlice = createSlice({
  name: "onlineUsers",
  initialState,
  reducers: {
    setOnlineUsers(state, action: PayloadAction<string[]>) {
      state.users = action.payload;
    },
    addOnlineUser(state, action: PayloadAction<string>) {
      if (!state.users.includes(action.payload)) {
        state.users.push(action.payload);
      }
    },
    removeOnlineUser(state, action: PayloadAction<string>) {
      state.users = state.users.filter((id) => id !== action.payload);
    },
    clearOnlineUsers(state) {
      state.users = [];
    },
  },
});

export const onlineUsersActions = onlineUsersSlice.actions;
export default onlineUsersSlice;
