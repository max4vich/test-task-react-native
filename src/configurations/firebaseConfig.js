import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBJlQsXpoIkgDbX3fADachb-37sAjFn9Ro",
    authDomain: "testing-react-native-32fa1.firebaseapp.com",
    projectId: "testing-react-native-32fa1",
    storageBucket: "testing-react-native-32fa1.firebasestorage.app",
    messagingSenderId: "718695350791",
    appId: "1:718695350791:web:916e3d3f16802853ea60a2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {auth, db};
