import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import WelcomePage from '../pages/WelcomePage';
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import MainTabs from '../components/HomePage/MainTabs';
import {useSelector} from "react-redux";
import {ActivityIndicator, View} from "react-native";

// Creating a Stack Navigator
const Stack = createStackNavigator();

export default function Navigate() {
    // Getting user and authentication loading status from Redux store
    const {user, isAuthLoading} = useSelector((state) => state.auth);

    // Show a loading spinner while authentication is in progress
    if (isAuthLoading) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large" color="#0071ff"/>
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                {user ? ( // If user is authenticated, show HomeScreen
                    <Stack.Screen name="HomeScreen" component={MainTabs}/>
                ) : ( // Otherwise, show the authentication pages
                    <>
                        <Stack.Screen name="WelcomeScreen" component={WelcomePage}/>
                        <Stack.Screen name="SignInScreen" component={SignInPage}/>
                        <Stack.Screen name="SignUpScreen" component={SignUpPage}/>
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
