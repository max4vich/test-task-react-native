import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import WelcomePage from '../pages/WelcomePage';
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import MainTabs from '../components/HomePage/MainTabs';
import {useSelector} from "react-redux";
import {ActivityIndicator, View} from "react-native";

const Stack = createStackNavigator();

export default function Navigate() {
    const {user, isAuthLoading} = useSelector((state) => state.auth);

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
                {user ? (
                    <Stack.Screen name="HomeScreen" component={MainTabs}/>
                ) : (
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
