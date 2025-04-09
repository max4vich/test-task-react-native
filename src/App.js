import React, {useEffect} from 'react';
import {Provider, useDispatch, useSelector} from 'react-redux';
import store from './configurations/store';
import {auth} from './configurations/firebaseConfig';
import {onAuthStateChanged} from 'firebase/auth';
import {logIn, logOut, finishLoading} from './configurations/slices/authSlice';
import MainStack from './utils/navigate';
import styled from 'styled-components/native';

const Wrapper = styled.View`
    flex: 1;
    background: white;
`;

function AuthHandler() {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                dispatch(logIn({uid: user.uid, email: user.email}));
            } else {
                dispatch(logOut());
            }
        });

        return unsubscribe;
    }, []);

    return <MainStack/>;
}


export default function App() {
    return (
        <Provider store={store}>
            <Wrapper>
                <AuthHandler/>
            </Wrapper>
        </Provider>
    );
}
