import React, {useRef, useEffect} from 'react';
import {Animated} from 'react-native';
import styled from 'styled-components/native';

const ButtonsContainer = styled(Animated.View)`
    flex-direction: row;
    justify-content: center;
    gap: 16px;
    margin-bottom: 32px;
`;

const ButtonBase = styled.TouchableOpacity`
    justify-content: center;
    align-items: center;
    padding: 12px 24px;
    border-radius: 24px;
    width: 120px;
`;

const SignInButton = styled(ButtonBase)`
    background-color: white;
`;

const SignInButtonText = styled.Text`
    font-size: 16px;
    font-weight: 700;
    color: #0071ff;
`;

const SignUpButton = styled(ButtonBase)`
    border: 2px solid white;
`;

const SignUpButtonText = styled.Text`
    font-size: 16px;
    font-weight: 700;
    color: white;
`;

const AuthButtonsComponent = ({navigation}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            delay: 500,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    const handleSignIn = () => {
        navigation.navigate('SignInScreen');
    };

    const handleSignUp = () => {
        navigation.navigate('SignUpScreen');
    };

    return (
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
