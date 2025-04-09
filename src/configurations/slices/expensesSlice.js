import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    expenses: [],
};

const expensesSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {
        setExpenses(state, action) {
            state.expenses = action.payload;
        },
        addExpense(state, action) {
            state.expenses = [action.payload, ...state.expenses];
        },
        removeExpense(state, action) {
            state.expenses = state.expenses.filter(exp => exp.id !== action.payload);
        },
        updateExpense(state, action) {
            const index = state.expenses.findIndex(exp => exp.id === action.payload.id);
            if (index !== -1) {
                state.expenses[index] = action.payload;
            }
        },
    },
});

export const {setExpenses, addExpense, removeExpense, updateExpense} = expensesSlice.actions;
export default expensesSlice.reducer;
