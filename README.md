# React Native To-Do App

A feature-rich To-Do application built with React Native, Expo, and Firebase, featuring user authentication, task management, and profile customization.

## Features

- **Authentication**: Email/password login and registration with Firebase Auth
- **Task Management**: Add, complete, and delete tasks with real-time sync
- **Profile Management**: Update username and profile photo
- **Persistent Storage**: Tasks stored per user in Firebase Firestore
- **Image Upload**: Profile photos stored in Firebase Storage
- **Responsive UI**: Clean, modern interface with React Native Paper

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Navigation**: React Navigation v6
- **UI Components**: React Native Paper
- **Image Handling**: Expo Image Picker

## Project Structure

```
├── src/
│   ├── components/
│   │   └── TabNavigator.js     # Bottom tab navigation
│   ├── screens/
│   │   ├── LoginScreen.js      # Authentication screen
│   │   ├── TodoScreen.js       # Task management screen
│   │   └── ProfileScreen.js    # User profile screen
│   └── services/
│       └── firebase.js         # Firebase configuration
├── App.js                      # Main app component
├── package.json               # Dependencies
└── README.md                  # This file
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Firebase project

### Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password provider
3. Create a Firestore database
4. Enable Firebase Storage
5. Get your Firebase configuration from Project Settings

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd todo-app
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Open `src/services/firebase.js`
   - Replace the placeholder config with your Firebase project configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### Running the App

1. Start the Expo development server:
```bash
npm start
```

2. Use one of the following options:
   - Scan the QR code with Expo Go app (iOS/Android)
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Press `w` for web browser

## Usage

### Authentication
- Register a new account or login with existing credentials
- User sessions persist automatically

### Task Management
- Add new tasks using the text input
- Tap the checkbox to mark tasks as complete/incomplete
- Tap the delete icon to remove tasks
- Tasks sync in real-time across devices

### Profile Management
- View your email and current username
- Update your username
- Upload and change your profile photo
- Logout to return to login screen

## Error Handling

The app includes comprehensive error handling for:
- Empty form submissions
- Network connectivity issues
- Firebase authentication errors
- Image upload failures
- Database operation errors

## Firebase Security Rules

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /todos/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Development Notes

- The app uses Expo managed workflow for easier development and deployment
- Firebase v9+ modular SDK is used for better tree-shaking
- React Native Paper provides Material Design components
- Real-time listeners ensure data stays synchronized
- Image uploads are optimized for mobile performance

## Troubleshooting

### Common Issues

1. **Firebase not connecting**: Verify your configuration in `firebase.js`
2. **Image picker not working**: Ensure proper permissions are set
3. **Build errors**: Clear cache with `expo r -c`
4. **Authentication issues**: Check Firebase Auth settings

### Performance Tips

- Images are automatically compressed before upload
- Firestore queries are optimized with user-specific filters
- Real-time listeners are properly cleaned up to prevent memory leaks

## License

This project is for educational purposes as part of a React Native internship assignment.