import React, {useState} from 'react';
import {
    Alert,
    Keyboard,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Platform,
} from 'react-native';
import styled from 'styled-components/native';
import {TextInput, Button} from 'react-native-paper';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../configurations/firebaseConfig';
import {Ionicons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import {useDispatch} from 'react-redux';
import {logIn} from '../configurations/slices/authSlice';

// Wrapper for the sign-up page using a gradient background
const SignUpPageWrapper = styled(LinearGradient).attrs({
    colors: ['#0071FF', '#00B4FF'],
    start: {x: 0, y: 0},
    end: {x: 1, y: 1},
})`
    flex: 1;
    width: 100%;
    align-items: center;
    justify-content: center;
    padding: 24px;
`;

// Back button positioned at the top left corner
const BackButton = styled(TouchableOpacity)`
    position: absolute;
    top: ${Platform.OS === 'ios' ? '44px' : '24px'};
    left: 24px;
    z-index: 10;
`;

// Card for displaying the form content
const Card = styled.View`
    width: 100%;
    max-width: 400px;
    background: white;
    border-radius: 24px;
    padding: 32px 24px;
    shadow-color: #000;
    shadow-opacity: 0.1;
    shadow-radius: 10px;
    elevation: 5;
`;

// Wrapper for each input field
const InputWrapper = styled.View`
    width: 100%;
    margin-bottom: 16px;
    overflow: hidden;
`;

// Style for the input fields
const inputStyle = {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 4,
};

// Styled button with custom padding
const StyledButton = styled(Button).attrs({
    contentStyle: {
        paddingVertical: 8,
    },
})`
    margin-top: 16px;
    border-radius: 24px;
`;

// Error text for validation feedback
const ErrorText = styled.Text`
    color: red;
    font-size: 12px;
    margin-top: 8px;
`;

// Title style for the page header
const Title = styled.Text`
    font-size: 28px;
    font-weight: bold;
    color: #0071ff;
    text-align: center;
    margin-bottom: 24px;
    font-family: Montserrat;
`;

export default function SignUpPage({navigation}) {
    const dispatch = useDispatch();

    // State hooks for managing input values and error states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);

    // Function to go back to the previous screen
    const handleGoBack = () => {
        navigation.goBack();
    };

    // Function to handle user sign-up
    const handleSignUp = async () => {
        // Dismiss the keyboard
        Keyboard.dismiss();

        // Reset error states
        setEmailError(false);
        setPasswordError(false);
        setConfirmPasswordError(false);

        let hasError = false;

        // Validate email field
        if (!email.trim()) {
            setEmailError(true);
            hasError = true;
        }
        // Validate password field
        if (!password.trim()) {
            setPasswordError(true);
            hasError = true;
        }
        // Validate confirm password field
        if (!confirmPassword.trim()) {
            setConfirmPasswordError(true);
            hasError = true;
        }
        // Check if passwords match
        if (password.trim() && confirmPassword.trim() && password !== confirmPassword) {
            setConfirmPasswordError(true);
            Alert.alert('Oops!', 'Passwords do not match.');
            return;
        }

        // If there's an error, show an alert
        if (hasError) {
            Alert.alert('Oops!', 'Please fill in all fields.');
            return;
        }

        // Attempt to create a new user with Firebase Authentication
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
            // Dispatch login action to store user data
            dispatch(logIn({
                uid: userCredential.user.uid,
                email: userCredential.user.email,
            }));
            Alert.alert('Success!', 'Account created successfully.');
            // Navigate to the HomeScreen after successful sign-up
            navigation.navigate('HomeScreen');
        } catch (error) {
            // Handle any errors during sign-up
            console.error('Error creating account:', error.message);
            Alert.alert('Whoops...', 'Unable to create account. Please try again.');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SignUpPageWrapper>
                {/* Back Button */}
                <BackButton onPress={handleGoBack}>
                    <Ionicons name="arrow-back" size={28} color="white"/>
                </BackButton>

                <Card>
                    {/* Title for the page */}
                    <Title>Create Account</Title>

                    {/* Email input */}
                    <InputWrapper>
                        <TextInput
                            label="Email"
                            mode="outlined"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            textContentType="emailAddress"
                            autoComplete="email"
                            importantForAutofill="yes"
                            error={emailError}
                            style={inputStyle}
                        />
                        {emailError && <ErrorText>Email is required</ErrorText>}
                    </InputWrapper>

                    {/* Password input */}
                    <InputWrapper>
                        <TextInput
                            label="Password"
                            mode="outlined"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            textContentType="newPassword"
                            autoComplete="password"
                            importantForAutofill="yes"
                            error={passwordError}
                            style={inputStyle}
                        />
                        {passwordError && <ErrorText>Password is required</ErrorText>}
                    </InputWrapper>

                    {/* Confirm Password input */}
                    <InputWrapper>
                        <TextInput
                            label="Confirm Password"
                            mode="outlined"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            textContentType="newPassword"
                            autoComplete="password"
                            importantForAutofill="yes"
                            error={confirmPasswordError}
                            style={inputStyle}
                        />
                        {confirmPasswordError && (
                            <ErrorText>Passwords do not match</ErrorText>
                        )}
                    </InputWrapper>

                    {/* Sign-Up button */}
                    <StyledButton
                        mode="contained"
                        onPress={handleSignUp}
                        buttonColor="#0071ff"
                        labelStyle={{fontWeight: 'bold', fontSize: 16}}
                    >
                        Sign Up
                    </StyledButton>
                </Card>
            </SignUpPageWrapper>
        </TouchableWithoutFeedback>
    );
}
