# Firestore Security Rules for PollPath Pro

Add these rules to your Firestore to allow users to read/write their own data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - users can read/write their own document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Polls collection - anyone can read, authenticated users can create
    match /polls/{pollId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (resource.data.creatorId == request.auth.uid || resource.data.userId == request.auth.uid);
    }
  }
}
```

## How to Apply These Rules

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Firestore Database** in the left sidebar
4. Click the **Rules** tab
5. Replace the existing rules with the rules above
6. Click **Publish**

## What These Rules Do

- **Users Collection**: Users can only read and write their own document (`/users/{their-uid}`)
- **Polls Collection**: 
  - Anyone can read polls (for Explore page)
  - Only authenticated users can create polls
  - Only poll creators can update or delete their polls

This allows the Pro subscription system to work while maintaining security.
