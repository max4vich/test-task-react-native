import {createSlice} from '@reduxjs/toolkit';

// Initial state for authentication
const initialState = {
    isLoggedIn: false,      // Whether the user is currently logged in
    user: null,             // User data (null if not logged in)
    isAuthLoading: true,    // Tracks whether auth status is still loading
};

// Auth slice for handling login/logout and auth loading state
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Set user as logged in and store user data
        logIn(state, action) {
            state.isLoggedIn = true;
            state.user = action.payload;
            state.isAuthLoading = false;
        },
        // Reset user data and auth status on logout
        logOut(state) {
            state.isLoggedIn = false;
            state.user = null;
            state.isAuthLoading = false;
        },
        // Mark the end of the initial auth check (e.g. after auto-login attempt)
        finishLoading(state) {
            state.isAuthLoading = false;
        }
    },
});

// Export actions for dispatching
export const {logIn, logOut, finishLoading} = authSlice.actions;

// Export reducer to be used in the store
export default authSlice.reducer;
