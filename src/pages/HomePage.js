import React, { useState, useEffect } from 'react';
import {
    Alert,
    Keyboard,
    Modal,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Platform,
    View,
} from 'react-native';
import styled from 'styled-components/native';
import { TextInput, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../configurations/firebaseConfig';
import { useSelector, useDispatch } from 'react-redux';
import { setExpenses, removeExpense as removeExpenseAction } from '../configurations/slices/expensesSlice';

// Загальні стилі для сторінок
const PageWrapper = styled.View`
    flex: 1;
    background: #f0f4f7;
    padding: 24px;
    padding-bottom: 0;
`;

const Header = styled.View`
    margin-top: ${Platform.OS === 'ios' ? '44px' : '24px'};
    margin-bottom: 16px;
    align-items: center;
`;

const HeaderTitle = styled.Text`
    font-size: 26px;
    font-weight: bold;
    color: #0071ff;
    font-family: Montserrat;
    text-align: left;
    width: 100%;
    margin-bottom: 8px;
`;

const ExpenseCard = styled.View`
    background: white;
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 12px;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.1;
    shadow-radius: 4px;
    elevation: 3;
    border-left-width: 4px;
    border-left-color: #0071ff;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const ExpenseInfo = styled.View`
    flex: 1;
`;

const ExpenseTitle = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: #333;
`;

const ExpenseDetail = styled.Text`
    font-size: 14px;
    color: #666;
    margin-top: 4px;
`;

const CurrencySelector = styled.View`
    flex-direction: row;
    justify-content: flex-start;
    margin-bottom: 16px;
`;

const CurrencyOption = styled(TouchableOpacity)`
    flex-direction: row;
    align-items: center;
    margin-right: 20px;
`;

const CurrencyLabel = styled.Text`
    font-size: 16px;
    margin-left: 6px;
    color: #333;
`;

const AddExpenseButton = styled(Button).attrs({
    contentStyle: { paddingVertical: 8 },
})`
    margin-bottom: 16px;
    border-radius: 24px;
    background-color: #0071ff;
`;

const ModalContainer = styled.View`
    flex: 1;
    background: rgba(0, 0, 0, 0.6);
    justify-content: center;
    padding: 24px;
`;

const ModalContent = styled.View`
    background: white;
    border-radius: 16px;
    padding: 24px;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.2;
    shadow-radius: 4px;
    elevation: 5;
`;

const inputStyle = {
    backgroundColor: 'white',
    width: '100%',
    marginBottom: 12,
};

// Додаткові компоненти для категорій
const CategoryScroll = styled.ScrollView.attrs({
    horizontal: true,
    showsHorizontalScrollIndicator: false,
    contentContainerStyle: { paddingHorizontal: 8 },
})`
  margin-bottom: 16px;
`;

const CategoryButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 8px 12px;
  background: ${props => (props.selected ? "#0071ff" : "white")};
  border: 1px solid #0071ff;
  border-radius: 20px;
  margin-right: 8px;
`;

const CategoryText = styled.Text`
  margin-left: 6px;
  font-size: 16px;
  color: ${props => (props.selected ? "white" : "#0071ff")};
  font-weight: bold;
`;

// Дефолтні категорії для вибору у модальному вікні
const defaultCategories = [
    { name: "Food", icon: "fast-food-outline" },
    { name: "Transport", icon: "bus-outline" },
    { name: "Bills", icon: "receipt-outline" },
    { name: "Entertainment", icon: "videocam-outline" },
    { name: "Shopping", icon: "cart-outline" },
    { name: "Other", icon: "ellipsis-horizontal-outline" },
];

export default function HomePage() {
    const dispatch = useDispatch();

    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [currency, setCurrency] = useState('UAH');
    const [modalVisible, setModalVisible] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [editingExpenseId, setEditingExpenseId] = useState(null);

    const user = useSelector(state => state.auth.user);
    const expenses = useSelector(state => state.expenses.expenses);

    useEffect(() => {
        if (!user) return;
        const expensesRef = collection(db, 'expenses');
        const q = query(expensesRef, orderBy('date', 'desc'));
        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
                const uniqueExpenses = [];
                querySnapshot.forEach((docSnap) => {
                    const data = docSnap.data();
                    if (data.userId === user.uid) {
                        const createdAt =
                            data.createdAt && typeof data.createdAt.toDate === 'function'
                                ? data.createdAt.toDate().toISOString()
                                : data.createdAt;
                        const expenseItem = { id: docSnap.id, ...data, createdAt };
                        if (!uniqueExpenses.find(exp => exp.id === expenseItem.id)) {
                            uniqueExpenses.push(expenseItem);
                        }
                    }
                });
                dispatch(setExpenses(uniqueExpenses));
            },
            (error) => {
                console.error("Error fetching expenses: ", error);
            }
        );
        return () => unsubscribe();
    }, [user, dispatch]);

    const resetForm = () => {
        setTitle('');
        setAmount('');
        setCategory('');
        setDate('');
        setCurrency('UAH');
        setIsEditing(false);
        setEditingExpenseId(null);
    };

    const handleAddExpense = async () => {
        Keyboard.dismiss();
        if (!title.trim() || !amount.trim() || !category.trim() || !date.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        if (!user) {
            Alert.alert('Error', 'User not found. Please log in.');
            return;
        }
        const expenseData = {
            title: title.trim(),
            amount: parseFloat(amount),
            currency,
            category: category.trim(),
            date,
            userId: user.uid,
            createdAt: new Date(),
        };
        try {
            await addDoc(collection(db, 'expenses'), expenseData);
            Alert.alert('Success', 'Expense added successfully.');
            resetForm();
            setModalVisible(false);
        } catch (error) {
            console.error("Error adding expense: ", error);
            Alert.alert('Error', 'Failed to add expense. Please try again.');
        }
    };

    const handleUpdateExpense = async () => {
        Keyboard.dismiss();
        if (!title.trim() || !amount.trim() || !category.trim() || !date.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        if (!user) {
            Alert.alert('Error', 'User not found. Please log in.');
            return;
        }
        const expenseData = {
            title: title.trim(),
            amount: parseFloat(amount),
            currency,
            category: category.trim(),
            date,
        };
        try {
            const expenseRef = doc(db, 'expenses', editingExpenseId);
            await updateDoc(expenseRef, expenseData);
            Alert.alert('Success', 'Expense updated successfully.');
            resetForm();
            setModalVisible(false);
        } catch (error) {
            console.error("Error updating expense: ", error);
            Alert.alert('Error', 'Failed to update expense. Please try again.');
        }
    };

    const handleDeleteExpense = async (expenseId) => {
        try {
            await deleteDoc(doc(db, 'expenses', expenseId));
            dispatch(removeExpenseAction(expenseId));
            Alert.alert('Success', 'Expense deleted successfully.');
        } catch (error) {
            console.error("Error deleting expense: ", error);
            Alert.alert('Error', 'Failed to delete expense. Please try again.');
        }
    };

    const setCurrentDate = () => {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        setDate(formattedDate);
    };

    // Обробник відкриття модального вікна для редагування
    const handleEditExpense = (expense) => {
        setTitle(expense.title);
        setAmount(expense.amount.toString());
        setCategory(expense.category);
        setDate(expense.date);
        setCurrency(expense.currency);
        setEditingExpenseId(expense.id);
        setIsEditing(true);
        setModalVisible(true);
    };

    const renderExpense = ({ item }) => (
        <ExpenseCard>
            <ExpenseInfo>
                <ExpenseTitle>{item.title}</ExpenseTitle>
                <ExpenseDetail>Amount: {item.amount} {item.currency}</ExpenseDetail>
                <ExpenseDetail>Category: {item.category}</ExpenseDetail>
                <ExpenseDetail>Date: {item.date}</ExpenseDetail>
            </ExpenseInfo>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{ marginRight: 12 }} onPress={() => handleEditExpense(item)}>
                    <Ionicons name="pencil-outline" size={24} color="#0071ff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteExpense(item.id)}>
                    <Ionicons name="trash-outline" size={24} color="red" />
                </TouchableOpacity>
            </View>
        </ExpenseCard>
    );

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <PageWrapper>
                <Header>
                    <HeaderTitle>Expense Management</HeaderTitle>
                </Header>
                <FlatList
                    data={expenses}
                    keyExtractor={(item) => item.id}
                    renderItem={renderExpense}
                    ListEmptyComponent={
                        <ExpenseDetail style={{ textAlign: 'center', marginTop: 20 }}>
                            No expenses added
                        </ExpenseDetail>
                    }
                />
                <AddExpenseButton
                    mode="contained"
                    onPress={() => {
                        resetForm();
                        setModalVisible(true);
                    }}
                    labelStyle={{ fontWeight: 'bold', fontSize: 16, color: '#fff' }}
                >
                    Add Expense
                </AddExpenseButton>
                <Modal
                    visible={modalVisible}
                    animationType="slide"
                    transparent
                    onRequestClose={() => {
                        resetForm();
                        setModalVisible(false);
                    }}
                >
                    <ModalContainer>
                        <ModalContent>
                            <HeaderTitle style={{ fontSize: 24, color: '#0071ff', marginBottom: 16 }}>
                                {isEditing ? 'Edit Expense' : 'New Expense'}
                            </HeaderTitle>
                            <TextInput
                                label="Title (e.g., Groceries)"
                                mode="outlined"
                                value={title}
                                onChangeText={setTitle}
                                style={inputStyle}
                            />
                            <TextInput
                                label="Amount"
                                mode="outlined"
                                value={amount}
                                onChangeText={setAmount}
                                keyboardType="numeric"
                                style={inputStyle}
                            />
                            <View>
                                <ExpenseDetail style={{ marginBottom: 6, fontWeight: 'bold', fontSize: 16 }}>
                                    Currency:
                                </ExpenseDetail>
                                <CurrencySelector>
                                    <CurrencyOption onPress={() => setCurrency('UAH')}>
                                        <Ionicons
                                            name={currency === 'UAH' ? 'radio-button-on' : 'radio-button-off'}
                                            size={20}
                                            color="#0071ff"
                                        />
                                        <CurrencyLabel>UAH</CurrencyLabel>
                                    </CurrencyOption>
                                    <CurrencyOption onPress={() => setCurrency('USD')}>
                                        <Ionicons
                                            name={currency === 'USD' ? 'radio-button-on' : 'radio-button-off'}
                                            size={20}
                                            color="#0071ff"
                                        />
                                        <CurrencyLabel>USD</CurrencyLabel>
                                    </CurrencyOption>
                                </CurrencySelector>
                            </View>
                            {/* Видалено текстове поле для Category */}
                            <ExpenseDetail style={{ marginBottom: 6, fontWeight: 'bold', fontSize: 16 }}>
                                Select Category:
                            </ExpenseDetail>
                            <CategoryScroll>
                                {defaultCategories.map(({ name, icon }) => (
                                    <CategoryButton
                                        key={name}
                                        selected={category === name}
                                        onPress={() => setCategory(name)}
                                    >
                                        <Ionicons
                                            name={icon}
                                            size={20}
                                            color={category === name ? "white" : "#0071ff"}
                                        />
                                        <CategoryText selected={category === name}>
                                            {name}
                                        </CategoryText>
                                    </CategoryButton>
                                ))}
                            </CategoryScroll>
                            <TextInput
                                label="Date (YYYY-MM-DD)"
                                mode="outlined"
                                value={date}
                                onChangeText={setDate}
                                style={inputStyle}
                            />
                            <Button
                                mode="outlined"
                                onPress={setCurrentDate}
                                style={{ marginBottom: 16 }}
                            >
                                Set Current Date
                            </Button>
                            {isEditing ? (
                                <Button
                                    mode="contained"
                                    onPress={handleUpdateExpense}
                                    buttonColor="#0071ff"
                                    labelStyle={{ fontWeight: 'bold', fontSize: 16, color: '#fff' }}
                                    style={{ marginBottom: 8 }}
                                >
                                    Update Expense
                                </Button>
                            ) : (
                                <Button
                                    mode="contained"
                                    onPress={handleAddExpense}
                                    buttonColor="#0071ff"
                                    labelStyle={{ fontWeight: 'bold', fontSize: 16, color: '#fff' }}
                                    style={{ marginBottom: 8 }}
                                >
                                    Add Expense
                                </Button>
                            )}
                            <Button onPress={() => {
                                resetForm();
                                setModalVisible(false);
                            }} color="#0071ff">
                                Cancel
                            </Button>
                        </ModalContent>
                    </ModalContainer>
                </Modal>
            </PageWrapper>
        </TouchableWithoutFeedback>
    );
}
