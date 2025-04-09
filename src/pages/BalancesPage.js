import React, { useEffect, useState } from 'react';
import { Platform, FlatList } from 'react-native';
import styled from 'styled-components/native';
import { ActivityIndicator } from 'react-native-paper';


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

const BalanceText = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: #333;
`;

const AmountText = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: #06d6a0;
`;

const EmptyMessage = styled.Text`
    text-align: center;
    font-size: 16px;
    color: #666;
    margin-top: 24px;
`;


export default function BalancesPage() {
    const [balances, setBalances] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBalances = async () => {
            try {
                const snapshot = await firestore().collection('balances').get();
                const data = snapshot.docs.map(doc => doc.data());

                const totals = data.reduce((acc, item) => {
                    const { account, amount } = item;
                    acc[account] = (acc[account] || 0) + parseFloat(amount);
                    return acc;
                }, {});

                setBalances(totals);
            } catch (error) {
                console.error('Error fetching balances:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBalances();
    }, []);

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
                <ActivityIndicator size="large" color="#0071ff" />
            ) : Object.keys(balances).length === 0 ? (
                <EmptyMessage>No balances available</EmptyMessage>
            ) : (
                <FlatList
                    data={Object.entries(balances)}
                    renderItem={renderItem}
                    keyExtractor={([currency]) => currency}
                />
            )}
        </PageWrapper>
    );
}
