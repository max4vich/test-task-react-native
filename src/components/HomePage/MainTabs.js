import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';
import HomePage from '../../pages/HomePage';
import ExpensesPage from '../../pages/ExpensesPage';
import ProfilePage from '../../pages/ProfilePage';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Expenses') {
                        iconName = focused ? 'list' : 'list-outline';
                    } else if (route.name === 'Balances') {
                        iconName = focused ? 'wallet' : 'wallet-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color}/>;
                },
                tabBarActiveTintColor: '#0071ff',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
                tabBarStyle: {backgroundColor: 'white'},
            })}
        >
            <Tab.Screen name="Home" component={HomePage}/>
            <Tab.Screen name="Expenses" component={ExpensesPage}/>
            <Tab.Screen name="Profile" component={ProfilePage}/>
        </Tab.Navigator>
    );
}
