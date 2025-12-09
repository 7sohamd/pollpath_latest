import admin from 'firebase-admin';

let db = null;
let isInitialized = false;

/**
 * Initialize Firebase Admin SDK
 * Uses singleton pattern to avoid multiple initializations
 */
export function initializeFirebase() {
    if (isInitialized) {
        return db;
    }

    try {
        if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
            if (!admin.apps.length) {
                admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId: process.env.VITE_FIREBASE_PROJECT_ID,
                        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                    }),
                });
            }
            db = admin.firestore();
            isInitialized = true;
            console.log('✅ Firebase Admin initialized successfully');
        } else {
            console.log('⚠️  Firebase Admin credentials not found');
        }
    } catch (error) {
        console.error('⚠️  Failed to initialize Firebase Admin:', error.message);
    }

    return db;
}

/**
 * Get Firestore database instance
 * Initializes Firebase if not already initialized
 */
export function getFirestore() {
    if (!db) {
        initializeFirebase();
    }
    return db;
}

export { admin };
