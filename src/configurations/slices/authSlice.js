import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: false,
    user: null,
    isAuthLoading: true,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logIn(state, action) {
            state.isLoggedIn = true;
            state.user = action.payload;
            state.isAuthLoading = false;
        },
        logOut(state) {
            state.isLoggedIn = false;
            state.user = null;
            state.isAuthLoading = false;
        },
        finishLoading(state) {
            state.isAuthLoading = false;
        }
    },
});

export const {logIn, logOut, finishLoading} = authSlice.actions;
export default authSlice.reducer;
