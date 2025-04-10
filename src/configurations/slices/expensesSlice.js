import {createSlice} from '@reduxjs/toolkit';

// Initial state for the expenses feature
const initialState = {
    expenses: [], // List of all expense items
};

// Redux slice to manage expense-related actions and state
const expensesSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {
        // Replaces the current list of expenses with a new one
        setExpenses(state, action) {
            state.expenses = action.payload;
        },
        // Adds a new expense to the beginning of the list
        addExpense(state, action) {
            state.expenses = [action.payload, ...state.expenses];
        },
        // Removes an expense by its ID
        removeExpense(state, action) {
            state.expenses = state.expenses.filter(exp => exp.id !== action.payload);
        },
        // Updates an existing expense by its ID
        updateExpense(state, action) {
            const index = state.expenses.findIndex(exp => exp.id === action.payload.id);
            if (index !== -1) {
                state.expenses[index] = action.payload;
            }
        },
    },
});

// Export actions to be dispatched in components
export const {setExpenses, addExpense, removeExpense, updateExpense} = expensesSlice.actions;

// Export the reducer to be added to the store
export default expensesSlice.reducer;
