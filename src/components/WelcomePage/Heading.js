import React, {useRef, useEffect} from 'react';
import {Animated} from 'react-native';
import styled from 'styled-components/native';

const HeadingView = styled(Animated.View)`
    align-items: center;
    justify-content: center;
    margin-bottom: 32px;
`;

const WelcomeImage = styled(Animated.Image)`
    width: 96px;
    height: 96px;
    margin-bottom: 16px;
`;

const WelcomeText = styled(Animated.Text)`
    max-width: 80%;
    text-align: center;
    font-size: 32px;
    font-weight: 700;
    color: white;
    margin-bottom: 8px;
`;

const WelcomeParagraph = styled(Animated.Text)`
    max-width: 80%;
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    color: white;
    padding: 8px;
`;

export default function Heading() {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    return (
        <HeadingView style={{opacity: fadeAnim}}>
            <WelcomeImage
                source={{
                    uri: 'https://jqbqwaeactyuhvzdpiau.supabase.co/storage/v1/object/public/photos/subway_coin.png',
                }}
                resizeMode="contain"
            />
            <WelcomeText>Welcome to BudgetMate!</WelcomeText>
            <WelcomeParagraph>
                Your journey to financial freedom starts here. Sign up now and get exclusive perks!
            </WelcomeParagraph>
        </HeadingView>
    );
}
