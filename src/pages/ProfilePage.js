import React from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../configurations/slices/authSlice';
import { auth } from '../configurations/firebaseConfig';
import { signOut } from 'firebase/auth';

const PageWrapper = styled.View`
    flex: 1;
    background: white;
    padding: 24px;
    align-items: center;
    justify-content: center;
`;

const UserInfo = styled.View`
    margin-bottom: 24px;
    align-items: center;
`;

const UserName = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: #333;
`;

const UserEmail = styled.Text`
    font-size: 16px;
    color: grey;
`;

export default function ProfilePage() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            dispatch(logOut());
        } catch (error) {
            console.error('Error during sign out:', error);
            Alert.alert('Error', 'Failed to sign out. Please try again.');
        }
    };

    return (
        <PageWrapper>
            <UserInfo>
                <UserName>{user?.email || 'Unknown user'}</UserName>
                {/*<UserEmail>{user?.uid || ''}</UserEmail>*/}
            </UserInfo>
            <Button mode="contained" onPress={handleLogout} buttonColor="#0071ff">
                Sign Out
            </Button>
        </PageWrapper>
    );
}
