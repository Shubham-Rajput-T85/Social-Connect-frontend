import { createSlice } from "@reduxjs/toolkit";

const intialState = {
    severity: "", // "success" | "error" | "warning" | "info"
    message: "",
    callBack: null
}

const alertSlice = createSlice({
    name: "alert",
    initialState: intialState,
    reducers: {
        showAlert(state, action){
            state.severity = action.payload.severity;
            state.message = action.payload.message;
            state.callBack = action.payload.callBack || null;
        },
        clearAlert(state){
            state.severity = "";
            state.message = "";
            state.callBack = null;
        }
    }
});

export const alertActions = alertSlice.actions;
export default alertSlice;
