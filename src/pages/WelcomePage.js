import React, {useRef, useEffect} from 'react';
import {Animated} from 'react-native';
import styled from 'styled-components/native';
import {LinearGradient} from 'expo-linear-gradient';
import Header from "../components/WelcomePage/Heading";
import AuthButtons from "../components/WelcomePage/AuthButtons";

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

const ExtraText = styled(Animated.Text)`
    font-size: 14px;
    font-weight: 500;
    color: white;
    margin-top: 16px;
`;

export default function WelcomePage({navigation}) {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            delay: 1000,
            useNativeDriver: true,
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
