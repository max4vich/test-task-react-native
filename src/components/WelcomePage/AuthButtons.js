import React, {useRef, useEffect} from 'react';
import {Animated} from 'react-native';
import styled from 'styled-components/native';

// Animated container for holding the buttons with fade-in effect
const ButtonsContainer = styled(Animated.View)`
    flex-direction: row;
    justify-content: center;
    gap: 16px;
    margin-bottom: 32px;
`;

// Base style for both buttons
const ButtonBase = styled.TouchableOpacity`
    justify-content: center;
    align-items: center;
    padding: 12px 24px;
    border-radius: 24px;
    width: 120px;
`;

// "Sign In" button with white background
const SignInButton = styled(ButtonBase)`
    background-color: white;
`;

// Text styling for the "Sign In" button
const SignInButtonText = styled.Text`
    font-size: 16px;
    font-weight: 700;
    color: #0071ff;
`;

// "Sign Up" button with white border
const SignUpButton = styled(ButtonBase)`
    border: 2px solid white;
`;

// Text styling for the "Sign Up" button
const SignUpButtonText = styled.Text`
    font-size: 16px;
    font-weight: 700;
    color: white;
`;

// AuthButtonsComponent displays "Sign In" and "Sign Up" buttons with animation
const AuthButtonsComponent = ({navigation}) => {
    // Animated value for fading in the buttons
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Trigger fade-in animation on mount
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            delay: 500,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    // Navigate to SignIn screen
    const handleSignIn = () => {
        navigation.navigate('SignInScreen');
    };

    // Navigate to SignUp screen
    const handleSignUp = () => {
        navigation.navigate('SignUpScreen');
    };

    return (
        // Apply animated opacity to container
        <ButtonsContainer style={{opacity: fadeAnim}}>
            <SignInButton onPress={handleSignIn}>
                <SignInButtonText>Sign In</SignInButtonText>
            </SignInButton>
            <SignUpButton onPress={handleSignUp}>
                <SignUpButtonText>Sign Up</SignUpButtonText>
            </SignUpButton>
        </ButtonsContainer>
    );
};

export default AuthButtonsComponent;
