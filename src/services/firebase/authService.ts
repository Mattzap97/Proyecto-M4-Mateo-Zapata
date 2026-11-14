import { auth } from "./firebaseConfig";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    type UserCredential,
} from "firebase/auth"


// Registrar Usuario con email y contraseña

export const registerWithEmail = (email: string, password: string): Promise<UserCredential> => {
    return createUserWithEmailAndPassword(auth, email, password);
}

// Iniciar sesión con email y contraseña

export const loginWithEmail = (email: string, password: string): Promise<UserCredential> => {
    return signInWithEmailAndPassword(auth, email, password);
}

// Iniciar sesión con Google

export const loginWithGoogle = (): Promise<UserCredential> => {
    const provider = new GoogleAuthProvider();

    return signInWithPopup(auth, provider);
}

// Cerrar sesión

export const logout = (): Promise<void> => {
    return signOut(auth);
}
