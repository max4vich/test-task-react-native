import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import expensesReducer from './slices/expensesSlice';

// Configure the Redux store for the app
const store = configureStore({
    reducer: {
        // 'auth' slice handles user authentication state
        auth: authReducer,
        // 'expenses' slice manages the list of expenses
        expenses: expensesReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            // Disable serializable check to allow non-serializable data in actions/state
            serializableCheck: false,
        }),
});

// Export the configured store to be used in the app
export default store;
