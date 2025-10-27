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
        updateUser(state, action: PayloadAction<Partial<any>>) {
            if (state.user) {
              state.user = { ...state.user as any, ...action.payload as any };
            }
        },
        incrementFollowers: (state: any) => {
            state.user.followersCount += 1;
        },
        decrementFollowers: (state: any) => {
            state.user.followersCount -= 1;
        },
        incrementPosts: (state: any) => {
            state.user.postCount += 1;
        },
        decrementPosts: (state: any) => {
            state.user.postCount -= 1;
        },
        incrementFollowingUserCount: (state: any) => {
            state.user.followingCount += 1;
        },
        decrementFollowingUserCount: (state: any) => {
            state.user.followingCount -= 1;
        },
        incrementStoryCount: (state: any) => {
            state.user.storyCount += 1;
        },
        decrementStoryCount: (state: any) => {
            state.user.storyCount -= 1;
        },
        updateStoryCount: (state: any, action: PayloadAction<number>) => {
            if (state.user) {
                state.user.storyCount = action.payload;
            }
        }
    }
});

export const authActions = authSlice.actions;
export default authSlice;