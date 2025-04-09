import React, {useState, useEffect} from 'react';
import {
    Alert,
    Keyboard,
    Modal,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Platform, View,
} from 'react-native';
import styled from 'styled-components/native';
import {TextInput, Button} from 'react-native-paper';
import {Ionicons} from '@expo/vector-icons';
import {collection, addDoc, query, orderBy, onSnapshot, doc, deleteDoc} from 'firebase/firestore';
import {db} from '../configurations/firebaseConfig';
import {useSelector, useDispatch} from 'react-redux';
import {setExpenses, removeExpense as removeExpenseAction} from '../configurations/slices/expensesSlice';

// Common styles for pages with white background
const PageWrapper = styled.View`
    flex: 1;
    background: white;
    padding: 24px;
`;

const Header = styled.View`
    margin-top: ${Platform.OS === 'ios' ? '44px' : '24px'};
    margin-bottom: 16px;
    align-items: center;
`;

const HeaderTitle = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: #333;
    font-family: Montserrat;
    text-align: left;
    width: 100%;
`;

// Expense card styling
const ExpenseCard = styled.TouchableOpacity`
    background: white;
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 12px;
    elevation: 3;
    border: 1px solid #333;
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
    color: #666;
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

const StyledButton = styled(Button).attrs({
    contentStyle: {paddingVertical: 10},
})`
    border-radius: 28px;
    margin-bottom: 12px;
`;

const AddExpenseButton = styled(Button).attrs({
    contentStyle: {paddingVertical: 8},
})`
    margin-top: 16px;
    border-radius: 24px;
`;

const ModalContainer = styled.View`
    flex: 1;
    background: rgba(0, 0, 0, 0.5);
    justify-content: center;
    padding: 24px;
`;

const ModalContent = styled.View`
    background: white;
    border-radius: 16px;
    padding: 24px;
`;

const inputStyle = {
    backgroundColor: 'white',
    width: '100%',
    marginBottom: 12,
};


export default function HomePage() {
    const dispatch = useDispatch();

    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [currency, setCurrency] = useState('UAH');
    const [modalVisible, setModalVisible] = useState(false);

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
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.userId === user.uid) {
                        const createdAt =
                            data.createdAt && typeof data.createdAt.toDate === 'function'
                                ? data.createdAt.toDate().toISOString()
                                : data.createdAt;
                        const expenseItem = {id: doc.id, ...data, createdAt};
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

            setTitle('');
            setAmount('');
            setCategory('');
            setDate('');
            setModalVisible(false);
        } catch (error) {
            console.error("Error adding expense: ", error);
            Alert.alert('Error', 'Failed to add expense. Please try again.');
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
                        <ExpenseDetail style={{textAlign: 'center', marginTop: 20}}>
                            No expenses added
                        </ExpenseDetail>
                    }
                />

                <AddExpenseButton
                    mode="contained"
                    onPress={() => setModalVisible(true)}
                    buttonColor="#0071ff"
                    labelStyle={{fontWeight: 'bold', fontSize: 16}}
                >
                    Add Expense
                </AddExpenseButton>

                <Modal
                    visible={modalVisible}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setModalVisible(false)}
                >
                    <ModalContainer>
                        <ModalContent>
                            <HeaderTitle style={{fontSize: 24, color: '#0071ff', marginBottom: 16}}>
                                New Expense
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
                                <ExpenseDetail style={{marginBottom: 6, fontWeight: 'bold', fontSize: 16}}>
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
                            <TextInput
                                label="Category (e.g., Food, Transport, Bills)"
                                mode="outlined"
                                value={category}
                                onChangeText={setCategory}
                                style={inputStyle}
                            />
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
                                style={{marginBottom: 16}}
                            >
                                Set Current Date
                            </Button>

                            <Button
                                mode="contained"
                                onPress={handleAddExpense}
                                buttonColor="#0071ff"
                                labelStyle={{fontWeight: 'bold', fontSize: 16}}
                                style={{marginBottom: 8}}
                            >
                                Add
                            </Button>
                            <Button onPress={() => setModalVisible(false)} color="#0071ff">
                                Cancel
                            </Button>
                        </ModalContent>
                    </ModalContainer>
                </Modal>
            </PageWrapper>
        </TouchableWithoutFeedback>
    );
}
