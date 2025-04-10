# Test Task React Native

## Project Overview

This project is a **React Native** application that provides a sign-in page for users to log in with their email and password. It integrates with **Firebase** for authentication, offering a secure sign-in flow. Users can sign in with their registered credentials, and the app will navigate to the "HomeScreen" upon successful authentication.

---

## Setup Instructions

### Prerequisites

Before you start, ensure you have the following installed:
- [Node.js](https://nodejs.org/en/) (version 14 or higher)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (for React Native development)
- A [Firebase](https://firebase.google.com/) account (for authentication)
- A code editor (e.g., [Visual Studio Code](https://code.visualstudio.com/))

### Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/max4vich/test-task-react-native.git
cd test-task-react-native
```

### Install Dependencies

Install all the required dependencies:

```bash
npm install
```

### Firebase Configuration

1. Go to the Firebase Console and create a new project (or use an existing one).

2. Add a web application to your Firebase project and obtain your Firebase configuration details (API key, Auth domain, etc.).

3. Open the file configurations/firebaseConfig.js and update it with your Firebase configuration:

```bash
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

### Running the App

To run the app, use:

```bash
npm start
```

This will start the Expo development server. You can run the app on an emulator or a physical device using the Expo Go app.

### Backend Service: Firebase

Why Firebase?

Firebase was chosen as the backend service because it offers:

- Easy-to-use Authentication: Provides robust support for email/password authentication (and other methods such as Google, Facebook, etc.) with minimal setup.

- Real-time Database/Firestore: Seamlessly integrates with a real-time database for future app enhancements.

- Scalability: Firebase scales well for both small and large applications.

- Cross-platform Support: Easily integrates with React Native for both Android and iOS platforms.

Firebase abstracts many backend complexities, allowing developers to focus on frontend and user experience.

### Known Issues or Limitations

1. Error Handling: Error messages are basic. Enhancing error handling (e.g., for network issues) would improve the user experience.

2. Password Recovery: The app does not currently support password recovery. This can be added using Firebase's built-in password reset functionality.

3. Mobile Keyboard Behavior: The keyboard dismissal behavior might vary across devices and platforms. Additional tweaks may be needed for consistent performance.

4. UI/UX Improvements: The design is simple and could benefit from further optimization for various screen sizes.

### Conclusion
This project provides a functional sign-in page using React Native and Firebase for authentication. It serves as a foundation for further development, such as password recovery, user profile management, and deeper integration with other Firebase services.

Feel free to contribute or suggest improvements. Happy coding! 🎉
