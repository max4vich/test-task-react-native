import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

// Firebase configuration object containing project credentials
const firebaseConfig = {
    apiKey: "AIzaSyBJlQsXpoIkgDbX3fADachb-37sAjFn9Ro", // Public API key for Firebase
    authDomain: "testing-react-native-32fa1.firebaseapp.com", // Auth domain for Firebase Authentication
    projectId: "testing-react-native-32fa1", // Firebase project ID
    storageBucket: "testing-react-native-32fa1.firebasestorage.app", // Bucket for file storage
    messagingSenderId: "718695350791", // Sender ID for cloud messaging
    appId: "1:718695350791:web:916e3d3f16802853ea60a2" // Unique app identifier
};

// Initialize the Firebase app
const app = initializeApp(firebaseConfig);

// Get Firebase Authentication instance
const auth = getAuth(app);

// Get Firestore Database instance
const db = getFirestore(app);

// Export auth and db instances for use in the app
export {auth, db};
