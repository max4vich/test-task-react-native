import React, {useState} from 'react';
import {
    Alert, // Importing Alert to show alerts to the user
    Keyboard, // Importing Keyboard to dismiss it when needed
    Platform, // Platform-specific code handling
    TouchableOpacity, // Touchable component for button interactions
    TouchableWithoutFeedback, // Dismiss the keyboard when clicking outside
} from 'react-native';
import styled from 'styled-components/native';
import {TextInput, Button} from 'react-native-paper'; // Importing TextInput and Button from react-native-paper
import {signInWithEmailAndPassword} from 'firebase/auth'; // Firebase authentication function
import {auth} from '../configurations/firebaseConfig'; // Firebase configuration import
import {Ionicons} from '@expo/vector-icons'; // Icon library import
import {LinearGradient} from 'expo-linear-gradient'; // For gradient background
import {useDispatch} from 'react-redux'; // Redux dispatch for state management
import {logIn} from '../configurations/slices/authSlice'; // Redux action for logging in

// Gradient wrapper for the sign-in page background
const SignInPageWrapper = styled(LinearGradient).attrs({
    colors: ['#0071FF', '#00B4FF'],
    start: {x: 0, y: 0},
    end: {x: 1, y: 1},
})`
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: 24px;
`;

// Back button styling
const BackButton = styled(TouchableOpacity)`
    position: absolute;
    top: ${Platform.OS === 'ios' ? '44px' : '24px'};
    left: 24px;
    z-index: 10;
`;

// Card component for the form area
const Card = styled.View`
    width: 85%;
    max-width: 400px;
    background: white;
    border-radius: 24px;
    padding: 32px 24px;
    shadow-color: #000;
    shadow-opacity: 0.1;
    shadow-radius: 10px;
    elevation: 5;
`;

// Title styling
const Title = styled.Text`
    font-size: 28px;
    font-weight: bold;
    color: #0071ff;
    text-align: center;
    margin-bottom: 24px;
    font-family: Montserrat;
`;

// Wrapper for input fields
const InputWrapper = styled.View`
    width: 100%;
    margin-bottom: 16px;
    overflow: hidden;
`;

// Styled button for signing in
const StyledButton = styled(Button).attrs({
    contentStyle: {
        paddingVertical: 8,
    },
})`
    margin-top: 16px;
    border-radius: 24px;
`;

// Error text styling for invalid inputs
const ErrorText = styled.Text`
    color: red;
    font-size: 12px;
    margin-top: 8px;
`;

export default function SignInPage({navigation}) {
    const dispatch = useDispatch(); // Redux dispatch function

    // States for email, password, and error tracking
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    // Function to go back to the previous screen
    const handleGoBack = () => {
        navigation.goBack();
    };

    // Function to handle the sign-in process
    const handleSignIn = async () => {
        Keyboard.dismiss(); // Dismiss keyboard on sign-in attempt
        let hasError = false; // Flag for errors

        setEmailError(false); // Reset email error state
        setPasswordError(false); // Reset password error state

        // Check if email or password are empty
        if (!email.trim()) {
            setEmailError(true);
            hasError = true;
        }
        if (!password.trim()) {
            setPasswordError(true);
            hasError = true;
        }

        // Show alert if there are any errors
        if (hasError) {
            Alert.alert('Oops!', 'Please fill in all fields.');
            return;
        }

        try {
            // Firebase sign-in process
            const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
            // Dispatch login action with user data
            dispatch(logIn({uid: userCredential.user.uid, email: userCredential.user.email}));
            Alert.alert('Success!', 'You are signed in.');
            // Navigate to home screen after successful sign-in
            navigation.navigate('HomeScreen');
        } catch (error) {
            // Show error alert if sign-in fails
            Alert.alert('Whoops...', 'Incorrect email or password.');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SignInPageWrapper>
                {/* Back button to go to the previous screen */}
                <BackButton onPress={handleGoBack}>
                    <Ionicons name="arrow-back" size={28} color="white"/>
                </BackButton>
                <Card>
                    {/* Welcome text */}
                    <Title>Welcome Back 👋</Title>
                    <InputWrapper>
                        {/* Email input field */}
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
                            style={{backgroundColor: 'white', width: '100%'}}
                        />
                        {/* Display error message if email is invalid */}
                        {emailError && <ErrorText>Email is required</ErrorText>}
                    </InputWrapper>

                    <InputWrapper>
                        {/* Password input field */}
                        <TextInput
                            label="Password"
                            mode="outlined"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            error={passwordError}
                            textContentType="password"
                            autoComplete="password"
                            style={{backgroundColor: 'white', width: '100%'}}
                        />
                        {/* Display error message if password is invalid */}
                        {passwordError && <ErrorText>Password is required</ErrorText>}
                    </InputWrapper>

                    {/* Sign-in button */}
                    <StyledButton
                        mode="contained"
                        onPress={handleSignIn}
                        buttonColor="#0071ff"
                        labelStyle={{fontWeight: 'bold', fontSize: 16}}
                    >
                        Sign In
                    </StyledButton>
                </Card>
            </SignInPageWrapper>
        </TouchableWithoutFeedback>
    );
}
