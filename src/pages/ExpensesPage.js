import React from 'react';
import {FlatList, View, TouchableOpacity, Dimensions} from 'react-native';
import styled from 'styled-components/native';
import {useSelector, useDispatch} from 'react-redux';
import {Ionicons} from '@expo/vector-icons';
import {removeExpense} from '../configurations/slices/expensesSlice';
import {PieChart} from 'react-native-chart-kit';
import {SafeAreaView} from 'react-native-safe-area-context';
import {deleteDoc, doc} from "firebase/firestore";
import {db} from "../configurations/firebaseConfig";

const screenWidth = Dimensions.get("window").width;

const Container = styled(SafeAreaView)`
    flex: 1;
    background: white;
`;

const ContentWrapper = styled.ScrollView`
    flex: 1;
    padding: 24px;
`;

const HeaderTitle = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 16px;
`;

const SummaryText = styled.Text`
    font-size: 16px;
    font-weight: bold;
    color: #444;
    margin-bottom: 8px;
`;

const ExpenseCard = styled.TouchableOpacity`
    background: white;
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 12px;
    border: 1px solid #333;
    elevation: 3;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const ExpenseInfo = styled.View`
    flex: 1;
`;

const ExpenseTitle = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: #333;
`;

const ExpenseDetail = styled.Text`
    font-size: 14px;
    color: grey;
    margin-top: 2px;
`;

const EmptyText = styled(ExpenseDetail)`
    text-align: center;
    margin-top: 20px;
`;

export default function ExpensesPage() {
    const expenses = useSelector((state) => state.expenses.expenses);
    const dispatch = useDispatch();

    const handleDeleteExpense = async (expenseId) => {
        try {
            await deleteDoc(doc(db, 'expenses', expenseId));
            dispatch(removeExpense(expenseId));
        } catch (error) {
            console.error('Failed to delete expense from Firestore:', error);
        }
    };

    const currentMonth = new Date().toISOString().slice(0, 7);
    const thisMonthExpenses = expenses.filter(exp => exp.date?.startsWith(currentMonth));

    const totalByCurrency = thisMonthExpenses.reduce((acc, exp) => {
        const currency = exp.currency || 'UAH';
        acc[currency] = (acc[currency] || 0) + parseFloat(exp.amount);
        return acc;
    }, {});

    const totalByCategory = thisMonthExpenses.reduce((acc, exp) => {
        const category = exp.category || 'Other';
        const currency = exp.currency || 'UAH';
        const key = `${currency} - ${category} `;

        acc[key] = (acc[key] || 0) + parseFloat(exp.amount);
        return acc;
    }, {});

    const chartColors = ['#d1ecff', '#80cbff', '#a6daff', 'rgba(90,189,255,0.55)', '#8338ec', '#ff9f1c', '#118ab2'];

    const pieChartData = Object.entries(totalByCategory).map(([name, population], index) => ({
        name,
        population,
        color: chartColors[index % chartColors.length],
        legendFontColor: '#333',
        legendFontSize: 14,
    }));

    const renderExpense = ({item}) => (
        <ExpenseCard activeOpacity={0.8}>
            <ExpenseInfo>
                <ExpenseTitle>{item.title}</ExpenseTitle>
                <ExpenseDetail>Amount: {item.amount} {item.currency}</ExpenseDetail>
                <ExpenseDetail>Category: {item.category}</ExpenseDetail>
                <ExpenseDetail>Date: {item.date}</ExpenseDetail>
            </ExpenseInfo>
            <TouchableOpacity onPress={() => handleDeleteExpense(item.id)}>
                <Ionicons name="trash-outline" size={24} color="red"/>
            </TouchableOpacity>
        </ExpenseCard>
    );

    return (
        <Container>
            <ContentWrapper>
                <HeaderTitle>Monthly Summary</HeaderTitle>

                {Object.entries(totalByCurrency).map(([currency, total]) => (
                    <SummaryText key={currency}>
                        Total ({currency}): {total.toFixed(2)} {currency}
                    </SummaryText>
                ))}

                <SummaryText>Expenses by Category</SummaryText>

                {pieChartData.length > 0 ? (
                    <PieChart
                        data={pieChartData}
                        width={screenWidth - 48}
                        height={220}
                        chartConfig={{
                            backgroundColor: '#fff',
                            backgroundGradientFrom: '#fff',
                            backgroundGradientTo: '#fff',
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: () => '#333',
                        }}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="16"
                        absolute
                    />
                ) : (
                    <ExpenseDetail style={{marginBottom: 16}}>No categories to show.</ExpenseDetail>
                )}

                <HeaderTitle>All Expenses</HeaderTitle>

                {thisMonthExpenses.length === 0 ? (
                    <EmptyText>No expenses this month.</EmptyText>
                ) : (
                    <FlatList
                        data={thisMonthExpenses}
                        keyExtractor={(item) => item.id}
                        renderItem={renderExpense}
                        scrollEnabled={false}
                    />
                )}
            </ContentWrapper>
        </Container>
    );
}
