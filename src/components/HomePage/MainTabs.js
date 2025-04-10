import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';

// Import individual page components for each tab
import HomePage from '../../pages/HomePage';
import ExpensesPage from '../../pages/ExpensesPage';
import ProfilePage from '../../pages/ProfilePage';

// Create the bottom tab navigator
const Tab = createBottomTabNavigator();

// MainTabs sets up the bottom tab navigation between Home, Expenses, and Profile
export default function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                // Define icons for each tab based on the route name and focus state
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

                    // Return the Ionicons icon for the tab
                    return <Ionicons name={iconName} size={size} color={color}/>;
                },
                // Active and inactive tab icon colors
                tabBarActiveTintColor: '#0071ff',
                tabBarInactiveTintColor: 'gray',
                // Hide the header on each screen
                headerShown: false,
                // Style for the bottom tab bar
                tabBarStyle: {backgroundColor: 'white'},
            })}
        >
            {/* Define each tab screen and its corresponding component */}
            <Tab.Screen name="Home" component={HomePage}/>
            <Tab.Screen name="Expenses" component={ExpensesPage}/>
            <Tab.Screen name="Profile" component={ProfilePage}/>
        </Tab.Navigator>
    );
}
