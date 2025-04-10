import React, {useRef, useEffect} from 'react';
import {Animated} from 'react-native';
import styled from 'styled-components/native';

// Container for the heading section with fade-in animation
const HeadingView = styled(Animated.View)`
    align-items: center;
    justify-content: center;
    margin-bottom: 32px;
`;

// Animated image for the welcome icon/logo
const WelcomeImage = styled(Animated.Image)`
    width: 96px;
    height: 96px;
    margin-bottom: 16px;
`;

// Main welcome title text
const WelcomeText = styled(Animated.Text)`
    max-width: 80%;
    text-align: center;
    font-size: 32px;
    font-weight: 700;
    color: white;
    margin-bottom: 8px;
`;

// Supporting paragraph text under the title
const WelcomeParagraph = styled(Animated.Text)`
    max-width: 80%;
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    color: white;
    padding: 8px;
`;

// Heading component with animated appearance, title, image and description
export default function Heading() {
    // Animated value for fade-in opacity
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Trigger the fade-in animation on component mount
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    return (
        // Apply fade-in animation to the entire heading section
        <HeadingView style={{opacity: fadeAnim}}>
            {/* Welcome image/logo */}
            <WelcomeImage
                source={{
                    uri: 'https://jqbqwaeactyuhvzdpiau.supabase.co/storage/v1/object/public/photos/subway_coin.png',
                }}
                resizeMode="contain"
            />
            {/* Welcome title */}
            <WelcomeText>Welcome to BudgetMate!</WelcomeText>
            {/* Supporting description */}
            <WelcomeParagraph>
                Your journey to financial freedom starts here. Sign up now and get exclusive perks!
            </WelcomeParagraph>
        </HeadingView>
    );
}
