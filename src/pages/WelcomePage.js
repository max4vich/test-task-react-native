import React, {useRef, useEffect} from 'react';
import {Animated} from 'react-native';
import styled from 'styled-components/native';
import {LinearGradient} from 'expo-linear-gradient';
import Header from "../components/WelcomePage/Heading";
import AuthButtons from "../components/WelcomePage/AuthButtons";

// Gradient background container
const GradientWrapper = styled(LinearGradient).attrs({
    colors: ['#0071FF', '#00B4FF'],
    start: {x: 0, y: 0},
    end: {x: 1, y: 1},
})`
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: 24px;
`;

// Animated text for the footer
const ExtraText = styled(Animated.Text)`
    font-size: 14px;
    font-weight: 500;
    color: white;
    margin-top: 16px;
`;

export default function WelcomePage({navigation}) {
    // Creating a reference for animation value
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Animating fade-in effect on component mount
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1, // End opacity
            duration: 1000, // Animation duration
            delay: 1000, // Delay before starting animation
            useNativeDriver: true, // Using native driver for performance
        }).start();
    }, [fadeAnim]);

    return (
        <GradientWrapper>
            <Header/>
            <AuthButtons navigation={navigation}/>
            <ExtraText style={{opacity: fadeAnim}}>
                Powered by BudgetMate
            </ExtraText>
        </GradientWrapper>
    );
}
