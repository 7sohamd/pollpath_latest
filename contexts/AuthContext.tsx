import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    ConfirmationResult
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProData } from '../types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isPro: boolean;
    proPlan: string | null;
    proSince: Date | null;
    signUp: (email: string, password: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signInWithGitHub: () => Promise<void>;
    signInWithPhone: (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => Promise<ConfirmationResult>;
    signOut: () => Promise<void>;
    refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPro, setIsPro] = useState(false);
    const [proPlan, setProPlan] = useState<string | null>(null);
    const [proSince, setProSince] = useState<Date | null>(null);

    // Load user's Pro status from Firestore
    const loadUserData = async (user: User) => {
        console.log('loadUserData called for user:', user.uid);
        try {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const data = userDoc.data() as UserProData;
                console.log('User document data:', { isPro: data.isPro, proPlan: data.proPlan });
                setIsPro(data.isPro || false);
                setProPlan(data.proPlan || null);
                setProSince(data.proSince?.toDate?.() || null);
                console.log('State updated - isPro set to:', data.isPro);
            } else {
                console.log('User document does not exist, creating with defaults');
                // Create user document with default values
                await setDoc(userDocRef, {
                    email: user.email,
                    displayName: user.displayName,
                    isPro: false,
                    proPlan: null,
                    proSince: null,
                    createdAt: serverTimestamp(),
                });
                setIsPro(false);
                setProPlan(null);
                setProSince(null);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            // Set defaults on error
            setIsPro(false);
            setProPlan(null);
            setProSince(null);
        }
    };

    // Refresh user data (called after successful payment)
    const refreshUserData = async () => {
        console.log('refreshUserData called, user:', user?.uid);
        if (user) {
            await loadUserData(user);
            console.log('refreshUserData completed, new isPro:', isPro);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            if (user) {
                await loadUserData(user);
            } else {
                // Reset Pro status on sign out
                setIsPro(false);
                setProPlan(null);
                setProSince(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signUp = async (email: string, password: string) => {
        await createUserWithEmailAndPassword(auth, email, password);
    };

    const signIn = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    };

    const signInWithGitHub = async () => {
        const provider = new GithubAuthProvider();
        await signInWithPopup(auth, provider);
    };

    const signInWithPhone = async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => {
        return await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    };

    const signOut = async () => {
        await firebaseSignOut(auth);
    };

    const value = {
        user,
        loading,
        isPro,
        proPlan,
        proSince,
        signUp,
        signIn,
        signInWithGoogle,
        signInWithGitHub,
        signInWithPhone,
        signOut,
        refreshUserData,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
