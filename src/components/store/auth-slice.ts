import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
    user: null,
    initialized: false,
}

// const initialAuthState = localStorage.getItem("user")
//   ? { isAuthenticated: true, user: JSON.parse(localStorage.getItem("user")) }
//   : { isAuthenticated: false, user: null };

const authSlice = createSlice({
    name: "auth",
    initialState: initialAuthState,
    reducers: {
        login(state, action){
            state.user = action.payload;
            state.initialized = true;
        },
        logout(state){
            state.user = null;
            state.initialized = true;
        },
        setInitialized(state) {
            state.initialized = true;
        }
    } 
});

export const authActions = authSlice.actions;
export default authSlice;
