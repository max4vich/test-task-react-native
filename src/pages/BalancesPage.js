import React, { useEffect, useState } from 'react';
import { Platform, FlatList } from 'react-native';
import styled from 'styled-components/native';
import { ActivityIndicator } from 'react-native-paper';

// Styled component for page wrapper with padding and background color
const PageWrapper = styled.View`
    flex: 1;
    background: white;
    padding: 24px;
`;

// Styled component for header, with conditional margin based on platform (iOS vs Android)
const Header = styled.View`
    margin-top: ${Platform.OS === 'ios' ? '44px' : '24px'};
    margin-bottom: 16px;
    align-items: center;
`;

// Styled component for header title
const HeaderTitle = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: #333;
    font-family: Montserrat;
    text-align: left;
    width: 100%;
`;

// Styled component for the balance card, used to display individual account balances
const BalanceCard = styled.View`
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

// Styled component for the balance text label (currency)
const BalanceText = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: #333;
`;

// Styled component for the amount text (balance amount)
const AmountText = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: #06d6a0;
`;

// Styled component for an empty state message when no balances are available
const EmptyMessage = styled.Text`
    text-align: center;
    font-size: 16px;
    color: #666;
    margin-top: 24px;
`;

export default function BalancesPage() {
    // State to hold balances data and loading state
    const [balances, setBalances] = useState({});
    const [loading, setLoading] = useState(true);

    // Fetch balances from Firestore when the component mounts
    useEffect(() => {
        const fetchBalances = async () => {
            try {
                // Fetch the balance data from Firestore collection 'balances'
                const snapshot = await firestore().collection('balances').get();
                const data = snapshot.docs.map(doc => doc.data());

                // Aggregate the balances by account type
                const totals = data.reduce((acc, item) => {
                    const { account, amount } = item;
                    acc[account] = (acc[account] || 0) + parseFloat(amount);
                    return acc;
                }, {});

                // Update the state with aggregated balance data
                setBalances(totals);
            } catch (error) {
                console.error('Error fetching balances:', error);
            } finally {
                // Set loading to false after fetching the data
                setLoading(false);
            }
        };

        // Call the fetchBalances function when the component mounts
        fetchBalances();
    }, []);

    // Render function for each balance card item
    const renderItem = ({ item }) => {
        const [currency, amount] = item;
        return (
            <BalanceCard>
                <BalanceText>{currency}</BalanceText>
                <AmountText>{amount.toFixed(2)}</AmountText>
            </BalanceCard>
        );
    };

    return (
        <PageWrapper>
            <Header>
                <HeaderTitle>Your Accounts</HeaderTitle>
            </Header>

            {loading ? (
                // Show loading indicator while fetching data
                <ActivityIndicator size="large" color="#0071ff" />
            ) : Object.keys(balances).length === 0 ? (
                // Show empty message if no balances are available
                <EmptyMessage>No balances available</EmptyMessage>
            ) : (
                // Render a list of balance cards if balances are available
                <FlatList
                    data={Object.entries(balances)}
                    renderItem={renderItem}
                    keyExtractor={([currency]) => currency} // Unique key for each item based on currency
                />
            )}
        </PageWrapper>
    );
}
