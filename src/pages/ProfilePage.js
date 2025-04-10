import React from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../configurations/slices/authSlice';
import { auth } from '../configurations/firebaseConfig';
import { signOut } from 'firebase/auth';

// Styled components for the page layout
const PageWrapper = styled.View`
    flex: 1;
    background: white;
    padding: 24px;
    align-items: center;
    justify-content: center;
`;

// Styled component for user information section
const UserInfo = styled.View`
    margin-bottom: 24px;
    align-items: center;
`;

// Styled component for displaying user name
const UserName = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: #333;
`;

// Styled component for displaying user email
const UserEmail = styled.Text`
    font-size: 16px;
    color: grey;
`;

export default function ProfilePage() {
    const dispatch = useDispatch(); // Redux dispatch to trigger actions
    const user = useSelector((state) => state.auth.user); // Get current user from Redux state

    // Function to handle logout
    const handleLogout = async () => {
        try {
            await signOut(auth); // Sign out from Firebase
            dispatch(logOut()); // Dispatch logout action to Redux
        } catch (error) {
            console.error('Error during sign out:', error);
            Alert.alert('Error', 'Failed to sign out. Please try again.'); // Show error if sign-out fails
        }
    };

    return (
        <PageWrapper>
            <UserInfo>
                <UserName>{user?.email || 'Unknown user'}</UserName> {/* Display user email */}
                {/*<UserEmail>{user?.uid || ''}</UserEmail>*/} {/* Optionally display user UID */}
            </UserInfo>
            <Button mode="contained" onPress={handleLogout} buttonColor="#0071ff">
                Sign Out {/* Button to sign out */}
            </Button>
        </PageWrapper>
    );
}
