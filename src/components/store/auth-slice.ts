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
    }
});

export const authActions = authSlice.actions;
export default authSlice;

// // After creating a new post
// dispatch(authActions.updateUser({ postCount: user.postCount + 1 }));

// // After accepting a follow request
// dispatch(authActions.updateUser({ followersCount: user.followersCount + 1 }));

// // After unfollowing someone
// dispatch(authActions.updateUser({ followingCount: user.followingCount - 1 }));