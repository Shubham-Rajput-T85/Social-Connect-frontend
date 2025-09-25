import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialAuthState = {
    user: null,
    initialized: false,
}

const authSlice = createSlice({
    name: "auth",
    initialState: initialAuthState,
    reducers: {
        login(state, action) {
            state.user = action.payload;
            state.initialized = true;
        },
        logout(state) {
            state.user = null;
            state.initialized = true;
        },
        setInitialized(state) {
            state.initialized = true;
        },
        setUser(state, action: PayloadAction<any>) {
            state.user = action.payload;
            state.initialized = true;
        },
        clearUser(state) {
            state.user = null;
            state.initialized = true;
        },
        updateUserPrivacyStatus(state: any, action: PayloadAction<boolean>) {
            if (state.user) {
                state.user.isPrivate = action.payload;
            }
        },
    }
});

export const authActions = authSlice.actions;
export default authSlice;
